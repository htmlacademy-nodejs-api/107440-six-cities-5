import { Expose, Type } from 'class-transformer';
import { CityRdo } from '../../city/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class PremiumRentOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public preview: string;

  @Expose()
  public publishDate: string;

  @Expose()
  public price: number;

  @Expose()
  public rating: number;

  @Expose()
  public houseType: string;

  @Expose()
  public isFavorite: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public commentCount: number;

  @Expose({ name: 'cityId' })
  @Type(() => CityRdo)
  public city: CityRdo;

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public user: UserRdo;
}
