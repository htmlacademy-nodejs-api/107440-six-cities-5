import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DocumentType } from '@typegoose/typegoose';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/index.js';
import { RentOfferRdo, DetailedRentOfferRdo } from './index.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { RentOfferService } from './rent-offer.service.interface.js';
import { ParamRentOfferId } from './types/param-rentOfferId.type.js';
import { CreateRentOfferRequest } from './types/create-rent-offer-request.type.js';
import { UpdateRentOfferRequest } from './types/update-rent-offer-request.type.js';
import {
  DEFAULT_DISCUSSED_OFFER_COUNT,
  DEFAULT_NEW_OFFER_COUNT
} from './rent-offer.constants.js';
import { CreateRentOfferDto, UpdateRentOfferDto } from './index.js';
import { FavoriteEntity, FavoriteService } from '../favorite/index.js';
import { GetRentOffers } from './types/get-rent-offers-request.type.js';

@injectable()
export default class RentOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: Logger,
    @inject(Component.RentOfferService)
    private readonly rentOfferService: RentOfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
    @inject(Component.FavoriteService)
    private readonly favoriteService: FavoriteService
  ) {
    super(logger);

    this.logger.info('Register routes for RentOfferController');
    this.addRoute({
      path: '/:rentOfferId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(
          this.rentOfferService,
          'RentOffer',
          'rentOfferId'
        )
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateRentOfferDto)
      ]
    });
    this.addRoute({
      path: '/:rentOfferId',
      method: HttpMethod.Delete,
      handler: this.delete,
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
      path: '/:rentOfferId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('rentOfferId'),
        new ValidateDtoMiddleware(UpdateRentOfferDto),
        new DocumentExistsMiddleware(
          this.rentOfferService,
          'RentOffer',
          'rentOfferId'
        )
      ]
    });
    this.addRoute({
      path: '/:rentOfferId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('rentOfferId'),
        new DocumentExistsMiddleware(
          this.rentOfferService,
          'RentOffer',
          'rentOfferId'
        )
      ]
    });
    this.addRoute({
      path: '/bundles/new',
      method: HttpMethod.Get,
      handler: this.getNew
    });
    this.addRoute({
      path: '/bundles/discussed',
      method: HttpMethod.Get,
      handler: this.getDiscussed
    });
  }

  public async index({ tokenPayload, query }: GetRentOffers, resp: Response) {
    const { id } = tokenPayload || {};

    const rentOffers = await this.rentOfferService.find(query.limit);

    let favoritesObj: DocumentType<FavoriteEntity> | null;

    if (id) {
      favoritesObj = await this.favoriteService.findByUserId(id);
    }

    rentOffers.forEach((offer) => {
      offer.isFavorite =
        favoritesObj?.favorites?.some((favOffer) => favOffer.id === offer.id) ||
        false;
    });

    this.ok(resp, fillDTO(RentOfferRdo, rentOffers));
  }

  public async show(
    { params, tokenPayload }: Request<ParamRentOfferId>,
    res: Response
  ): Promise<void> {
    const { rentOfferId } = params;
    const { id } = tokenPayload || {};

    const offer = await this.rentOfferService.findById(rentOfferId);

    let isFavorite = false;

    if (id) {
      isFavorite = await this.favoriteService.isFavorite({
        userId: id,
        rentOfferId
      });
    }

    offer!.isFavorite = isFavorite;

    this.ok(res, fillDTO(DetailedRentOfferRdo, offer));
  }

  public async create(
    { body, tokenPayload }: CreateRentOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.rentOfferService.create({
      ...body,
      userId: tokenPayload.id
    });
    const offer = await this.rentOfferService.findById(result.id);
    this.created(res, fillDTO(RentOfferRdo, offer));
  }

  public async delete(
    { params, tokenPayload }: Request<ParamRentOfferId>,
    res: Response
  ) {
    const { id } = tokenPayload || {};
    const { rentOfferId } = params;

    await this.checkUserIdMatchOfferId(id, rentOfferId);

    const removedOffer = await this.rentOfferService.deleteById(rentOfferId);

    await this.commentService.deleteByRentOfferId(rentOfferId);

    this.noContent(res, removedOffer);
  }

  public async update(
    { body, params, tokenPayload }: UpdateRentOfferRequest,
    res: Response
  ) {
    const { id } = tokenPayload || {};
    const { rentOfferId } = params;

    await this.checkUserIdMatchOfferId(id, rentOfferId);

    const updatedOffer = await this.rentOfferService.updateById(
      params.rentOfferId,
      body
    );

    let isFavorite = false;

    if (id) {
      isFavorite = await this.favoriteService.isFavorite({
        userId: id,
        rentOfferId
      });
    }

    updatedOffer!.isFavorite = isFavorite;

    this.ok(res, fillDTO(DetailedRentOfferRdo, updatedOffer));
  }

  public async getComments(
    { params }: Request<ParamRentOfferId>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByRentOfferId(
      params.rentOfferId
    );
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async getNew(_req: Request, res: Response) {
    const newOffers = await this.rentOfferService.findNew(
      DEFAULT_NEW_OFFER_COUNT
    );
    this.ok(res, fillDTO(RentOfferRdo, newOffers));
  }

  public async getDiscussed(_req: Request, res: Response) {
    const discussedOffers = await this.rentOfferService.findDiscussed(
      DEFAULT_DISCUSSED_OFFER_COUNT
    );
    this.ok(res, fillDTO(RentOfferRdo, discussedOffers));
  }

  public async checkUserIdMatchOfferId(
    userId: string,
    rentOfferId: string
  ): Promise<void> {
    const offer = await this.rentOfferService.findById(rentOfferId);

    if (offer?.userId.toString() !== userId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Attemt to modify wrong rent offer',
        'DefaultRentOfferController'
      );
    }
  }
}
