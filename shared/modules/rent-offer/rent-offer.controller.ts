import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/index.js';
import { RentOfferRdo } from './rdo/rent-offer.rdo.js';

import { RentOfferService } from './rent-offer.service.interface.js';
import { ParamRentOfferId } from './types/param-rentOfferId.type.js';
import { CreateRentOfferRequest } from './types/create-rent-offer-request.type.js';
import { UpdateRentOfferRequest } from './types/update-rent-offer-request.type.js';

@injectable()
export default class RentOfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.RentOfferService)
    private readonly rentOfferService: RentOfferService
  ) {
    super(logger);

    this.logger.info('Register routes for RentOfferController');
    this.addRoute({
      path: '/:rentOfferId',
      method: HttpMethod.Get,
      handler: this.show
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({
      path: '/:rentOfferId',
      method: HttpMethod.Delete,
      handler: this.delete
    });
    this.addRoute({
      path: '/:rentOfferId',
      method: HttpMethod.Patch,
      handler: this.update
    });
  }

  public async index(_req: Request, resp: Response) {
    const rentOffers = await this.rentOfferService.find();
    this.ok(resp, fillDTO(RentOfferRdo, rentOffers));
  }

  public async show(
    { params }: Request<ParamRentOfferId>,
    res: Response
  ): Promise<void> {
    const { rentOfferId } = params;
    const offer = await this.rentOfferService.findById(rentOfferId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent offer with id ${rentOfferId} not found.`,
        'RentOfferController'
      );
    }

    this.ok(res, fillDTO(RentOfferRdo, offer));
  }

  public async create(
    { body }: CreateRentOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.rentOfferService.create(body);
    const offer = await this.rentOfferService.findById(result.id);
    this.created(res, fillDTO(RentOfferRdo, offer));
  }

  public async delete({ params }: Request<ParamRentOfferId>, res: Response) {
    const { rentOfferId } = params;
    const rentOffer = await this.rentOfferService.deleteById(rentOfferId);

    if (!rentOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent offer with id ${rentOfferId} not found.`,
        'RentOfferController'
      );
    }

    this.noContent(res, rentOffer);
  }

  public async update({ body, params }: UpdateRentOfferRequest, res: Response) {
    const updatedOffer = await this.rentOfferService.updateById(
      params.rentOfferId,
      body
    );

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Rent offer with id ${params.rentOfferId} not found.`,
        'RentOfferController'
      );
    }

    this.ok(res, fillDTO(RentOfferRdo, updatedOffer));
  }
}
