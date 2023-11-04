import { inject, injectable } from 'inversify';
import { RentOfferService } from './rent-offer.service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { UpdateRentOfferDto } from './dto/update-rent-offer.dto.js';
import { DEFAULT_OFFER_COUNT } from './rent-offer.constants.js';
import { CityEntity } from '../city/city.entity.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class DefaultRentOfferService implements RentOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.RentOfferModel)
    private readonly rentOfferModel: types.ModelType<RentOfferEntity>,
    @inject(Component.CityModel)
    private readonly cityModel: types.ModelType<CityEntity>
  ) {}

  public async create(
    dto: CreateRentOfferDto
  ): Promise<DocumentType<RentOfferEntity>> {
    const foundCity = await this.cityModel.exists({
      _id: dto.cityId
    });

    if (!foundCity) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The city does not exist',
        'DefaultRentOfferService'
      );
    }

    const result = await this.rentOfferModel.create(dto);
    this.logger.info(`New rent offer created: ${dto.title}`);

    return result;
  }

  public async find(count?: number): Promise<DocumentType<RentOfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.rentOfferModel
      .find()
      .sort({ createdAt: SortType.Down })
      .populate(['userId', 'cityId'])
      .limit(limit)
      .exec();
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
    if (dto.cityId) {
      const foundCity = await this.cityModel.exists({
        _id: dto.cityId
      });

      if (!foundCity) {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'The city does not exist',
          'DefaultRentOfferService'
        );
      }
    }

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
      .sort({ createdAt: SortType.Down })
      .populate(['userId', 'cityId'])
      .exec();
  }

  public async findPremiumByCityId(
    cityId: string,
    count?: number
  ): Promise<DocumentType<RentOfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.rentOfferModel
      .find({ cityId: cityId, isPremium: true }, {}, { limit })
      .sort({ createdAt: SortType.Down })
      .populate(['cityId'])
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
