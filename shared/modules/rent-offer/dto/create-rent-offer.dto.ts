import { HouseType, FeatureType } from '../../../types/index.js';

export class CreateRentOfferDto {
  public title: string;
  public description: string;
  public publishDate: Date;
  public cityId: string;
  public preview: string;
  public images: string;
  public isPremium: string;
  public isFavourite: string;
  public rating: number;
  public houseType: HouseType;
  public rooms: number;
  public guests: number;
  public price: number;
  public features: FeatureType[];
  public authorId: string;
  public commentCount: number;
}
