import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { FavoriteService } from './favorite.service.interface.js';
import { Component } from '../../types/index.js';
import { FavoriteEntity } from './favorite.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public async findByUserId(
    userId: string
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findOne({ userId: userId })
      .populate(['userId', 'favorites'])
      .populate({
        path: 'favorites',
        model: 'RentOfferEntity',
        populate: { path: 'cityId', model: 'CityEntity' }
      })
      .exec();
  }

  public async addToFavorite(
    dto: CreateFavoriteDto
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findOneAndUpdate(
        { userId: dto.userId },
        { $push: { favorites: dto.rentOfferId } },
        { new: true, upsert: true }
      )
      .populate(['userId', 'favorites'])
      .populate({
        path: 'favorites',
        model: 'RentOfferEntity',
        populate: { path: 'cityId', model: 'CityEntity' }
      })
      .exec();
  }

  public async removeFromFavorite(
    dto: CreateFavoriteDto
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findOneAndUpdate(
        { userId: dto.userId },
        { $pull: { favorites: dto.rentOfferId } },
        { new: true }
      )
      .populate(['userId', 'favorites'])
      .populate({
        path: 'favorites',
        model: 'RentOfferEntity',
        populate: { path: 'cityId', model: 'CityEntity' }
      })
      .exec();
  }

  public async findFavoriteById(
    dto: CreateFavoriteDto
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findOne({
        userId: dto.userId,
        favorites: { $elemMatch: { $eq: dto.rentOfferId } }
      })
      .populate(['userId', 'favorites'])
      .populate({
        path: 'favorites',
        model: 'RentOfferEntity',
        populate: { path: 'cityId', model: 'CityEntity' }
      })
      .exec();
  }

  public async isFavorite(dto: CreateFavoriteDto): Promise<boolean> {
    const favoriteObj = await this.findFavoriteById({
      userId: dto.userId,
      rentOfferId: dto.rentOfferId
    });

    return !!favoriteObj;
  }
}
