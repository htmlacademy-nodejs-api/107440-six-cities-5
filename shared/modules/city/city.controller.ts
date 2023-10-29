import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CityService } from './city.service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CityRdo } from './rdo/city.rdo.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { GetRentOffersFromCity } from './types/get-rent-offers-from-city.type.js';
import { RentOfferRdo, RentOfferService } from '../rent-offer/index.js';

@injectable()
export class CityController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CityService)
    private readonly cityService: CityService,
    @inject(Component.RentOfferService)
    private readonly rentOfferService: RentOfferService
  ) {
    super(logger);

    this.logger.info('Register routes for CityController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCityDto)
      ]
    });
    this.addRoute({
      path: '/:cityId/rentOffers',
      method: HttpMethod.Get,
      handler: this.getRentOffersFromCity,
      middlewares: [new ValidateObjectIdMiddleware('cityId')]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();
    const responseData = fillDTO(CityRdo, cities);
    this.ok(res, responseData);
  }

  public async create(
    {
      body
    }: Request<Record<string, unknown>, Record<string, unknown>, CreateCityDto>,
    res: Response
  ): Promise<void> {
    const existCity = await this.cityService.findByCityName(body.name);

    if (existCity) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `City with name «${body.name}» exists.`,
        'CityController'
      );
    }

    const result = await this.cityService.create(body);
    this.created(res, fillDTO(CityRdo, result));
  }

  public async getRentOffersFromCity(
    { params, query }: GetRentOffersFromCity,
    res: Response
  ): Promise<void> {
    const offers = await this.rentOfferService.findByCityId(
      params.cityId,
      query.limit
    );
    this.ok(res, fillDTO(RentOfferRdo, offers));
  }
}
