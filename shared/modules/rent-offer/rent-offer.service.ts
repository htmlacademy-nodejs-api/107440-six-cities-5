import { inject, injectable } from 'inversify';
import { RentOfferService } from './rent-offer.service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';

@injectable()
export class DefaultRentOfferService implements RentOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.RentOfferModel)
    private readonly rentOfferModel: types.ModelType<RentOfferEntity>
  ) {}

  public async create(
    dto: CreateRentOfferDto
  ): Promise<DocumentType<RentOfferEntity>> {
    const result = await this.rentOfferModel.create(dto);
    this.logger.info(`New rent offer created: ${dto.title}`);

    return result;
  }

  public async findById(
    rentOfferId: string
  ): Promise<DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel.findById(rentOfferId).exec();
  }
}
