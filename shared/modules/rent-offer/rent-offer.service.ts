import { inject, injectable } from 'inversify';
import { RentOfferService } from './rent-offer.service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { UpdateRentOfferDto } from './dto/update-rent-offer.dto.js';
import { DEFAULT_OFFER_COUNT } from './rent-offer.constants.js';

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

  public async find(): Promise<DocumentType<RentOfferEntity>[]> {
    return this.rentOfferModel.find().populate(['userId', 'cityId']).exec();
  }

  public async findById(
    rentOfferId: string
  ): Promise<DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel
      .findById(rentOfferId)
      .populate(['userId', 'cityId'])
      .exec();
  }

  public async deleteById(
    rentOfferId: string
  ): Promise<DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel.findByIdAndDelete(rentOfferId).exec();
  }

  public async updateById(
    rentOfferId: string,
    dto: UpdateRentOfferDto
  ): Promise<DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel
      .findByIdAndUpdate(rentOfferId, dto, { new: true })
      .populate(['userId', 'cityId'])
      .exec();
  }

  public async findByCityId(
    cityId: string,
    count?: number
  ): Promise<DocumentType<RentOfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.rentOfferModel
      .find({ cityId: cityId }, {}, { limit })
      .populate(['userId', 'cityId'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.rentOfferModel.exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(
    rentOfferId: string
  ): Promise<DocumentType<RentOfferEntity> | null> {
    return this.rentOfferModel
      .findByIdAndUpdate(rentOfferId, {
        $inc: {
          commentCount: 1
        }
      })
      .exec();
  }

  public async findNew(
    count: number
  ): Promise<DocumentType<RentOfferEntity>[]> {
    return this.rentOfferModel
      .find()
      .sort({ createdAt: SortType.Down })
      .limit(count)
      .populate(['userId', 'cityId'])
      .exec();
  }

  public async findDiscussed(
    count: number
  ): Promise<DocumentType<RentOfferEntity>[]> {
    return this.rentOfferModel
      .find()
      .sort({ commentCount: SortType.Down })
      .limit(count)
      .populate(['userId', 'cityId'])
      .exec();
  }
}
