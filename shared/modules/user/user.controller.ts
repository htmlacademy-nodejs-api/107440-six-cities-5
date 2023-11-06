import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  PrivateRouteMiddleware
} from '../../libs/rest/index.js';
import { UserService } from './user.service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './types/login-user-request.type.js';
import { CreateUserDto } from './index.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged.user.rdo.js';
import { RentOfferService } from '../rent-offer/rent-offer.service.interface.js';
import {
  FavoriteService,
  FavoriteRdo,
  ParamFavoriteReq
} from '../favorite/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.RentOfferService)
    private readonly rentOfferService: RentOfferService,
    @inject(Component.FavoriteService)
    private readonly favoriteService: FavoriteService
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/signup',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });

    this.addRoute({
      path: '/signin',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });

    this.addRoute({
      path: '/signin',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        )
      ]
    });

    this.addRoute({
      path: '/rentOffers/favorite',
      method: HttpMethod.Get,
      handler: this.getFavorite,
      middlewares: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/rentOffers/:rentOfferId/favorite',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(
          this.rentOfferService,
          'RentOffer',
          'rentOfferId'
        )
      ]
    });

    this.addRoute({
      path: '/rentOffers/:rentOfferId/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(
          this.rentOfferService,
          'RentOffer',
          'rentOfferId'
        )
      ]
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT')
    );
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);

    const responseData = fillDTO(LoggedUserRdo, user);

    this.ok(res, Object.assign(responseData, { token }));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  public async checkAuthenticate(
    { tokenPayload: { email } }: Request,
    res: Response
  ) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async getFavorite(
    { tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const { id } = tokenPayload || {};

    const result = await this.favoriteService.findByUserId(id);

    const filledData = fillDTO(FavoriteRdo, result);

    filledData?.favorites?.forEach((item) => (item.isFavorite = true));

    this.ok(res, filledData);
  }

  public async addFavorite(
    { params, tokenPayload }: Request<ParamFavoriteReq>,
    res: Response
  ): Promise<void> {
    console.log('addToFavorite');
    const { id } = tokenPayload || {};

    const dublicate = await this.favoriteService.findFavoriteById({
      userId: id,
      rentOfferId: params.rentOfferId
    });

    if (dublicate) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Rent Offer with id ${params.rentOfferId} is already added into favorite list.`,
        'RentOfferController'
      );
    }

    const result = await this.favoriteService.addToFavorite({
      userId: id,
      rentOfferId: params.rentOfferId
    });

    const filledData = fillDTO(FavoriteRdo, result);

    filledData?.favorites?.forEach((item) => (item.isFavorite = true));

    this.ok(res, filledData);
  }

  public async removeFavorite(
    { params, tokenPayload }: Request<ParamFavoriteReq>,
    res: Response
  ): Promise<void> {
    const { id } = tokenPayload || {};

    const favoriteObj = await this.favoriteService.findFavoriteById({
      userId: id,
      rentOfferId: params.rentOfferId
    });

    if (!favoriteObj) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Rent Offer with id ${params.rentOfferId} does not exist in favorite list.`,
        'RentOfferController'
      );
    }

    const result = await this.favoriteService.removeFromFavorite({
      userId: id,
      rentOfferId: params.rentOfferId
    });

    const filledData = fillDTO(FavoriteRdo, result);

    filledData?.favorites?.forEach((item) => (item.isFavorite = true));

    this.ok(res, filledData);
  }
}
