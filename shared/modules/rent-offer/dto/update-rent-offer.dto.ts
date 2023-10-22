import { HouseType, FeatureType } from '../../../types/index.js';

export class UpdateRentOfferDto {
  public title?: string;
  public description?: string;
  public publishDate?: Date;
  public cityId?: string;
  public preview?: string;
  public images?: string;
  public isPremium?: boolean;
  public isFavourite?: boolean;
  public rating?: number;
  public houseType?: HouseType;
  public rooms?: number;
  public guests?: number;
  public price?: number;
  public features?: FeatureType[];
  public commentCount?: number;
}
