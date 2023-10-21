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

import { RentOfferService } from './rent-offer.service.interface.js';
import { ParamRentOfferId } from './types/param-rentOfferId.type.js';

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

    this.ok(res, offer);
  }
}
