import { CityService } from './city.service.interface.js';
import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CityEntity } from './city.entity.js';
import { MAX_CITIES_COUNT } from './city.constants.js';
import { CreateCityDto } from './dto/create-city.dto.js';

@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityModel)
    private readonly cityModel: types.ModelType<CityEntity>
  ) {}

  public async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const result = await this.cityModel.create(dto);
    this.logger.info(`New city created: ${dto.name}`);
    return result;
  }

  public async findByCityId(
    cityId: string
  ): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findById(cityId).exec();
  }

  public async findByCityName(
    cityName: string
  ): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({ name: cityName }).exec();
  }

  public async findByCityNameOrCreate(
    cityName: string,
    dto: CreateCityDto
  ): Promise<DocumentType<CityEntity>> {
    const existedCity = await this.findByCityName(cityName);

    if (existedCity) {
      return existedCity;
    }

    return this.create(dto);
  }

  public async find(): Promise<DocumentType<CityEntity>[]> {
    return this.cityModel
      .aggregate([
        {
          $lookup: {
            from: 'rentOffers',
            let: { cityId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$cityId', '$$cityId'] // Filter rent offers based on cityId
                  }
                }
              },
              { $project: { _id: 1 } }
            ],
            as: 'rentOffers'
          }
        },
        {
          $addFields: {
            id: { $toString: '$_id' },
            rentOfferCount: { $size: '$rentOffers' }
          }
        },
        { $unset: 'rentOffers' },
        { $limit: MAX_CITIES_COUNT },
        { $sort: { rentOfferCount: SortType.Down } }
      ])
      .exec();
  }
}
