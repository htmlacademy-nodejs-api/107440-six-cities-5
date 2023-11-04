import { Expose, Type, Transform } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { RentOfferRdo } from '../../rent-offer/index.js';

export class FavoriteRdo {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  public id: string;

  @Expose()
  public createdAt: string;

  @Expose()
  @Type(() => UserRdo)
  public userId: UserRdo;

  @Expose()
  @Type(() => RentOfferRdo)
  public favorites: RentOfferRdo[];
}
