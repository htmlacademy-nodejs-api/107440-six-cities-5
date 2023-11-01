import { IsMongoId } from 'class-validator';
import { CreateFavoriteMessages } from './create-favorite.messages.js';

export class CreateFavoriteDto {
  @IsMongoId({ message: CreateFavoriteMessages.userId.invalidId })
  public userId: string;

  @IsMongoId({ message: CreateFavoriteMessages.rentOfferId.invalidId })
  public rentOfferId: string;
}
