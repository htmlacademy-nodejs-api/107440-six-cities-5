import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsBoolean,
  IsLatitude,
  IsLongitude
} from 'class-validator';
import { HouseType, FeatureType } from '../../../types/index.js';
import { CreateRentOfferValidationMessage } from './create-rent-offer.messages.js';

export class CreateRentOfferDto {
  @MinLength(10, { message: CreateRentOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateRentOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, {
    message: CreateRentOfferValidationMessage.description.minLength
  })
  @MaxLength(1024, {
    message: CreateRentOfferValidationMessage.description.maxLength
  })
  public description: string;

  @IsDateString(
    {},
    { message: CreateRentOfferValidationMessage.postDate.invalidFormat }
  )
  public publishDate: Date;

  @IsMongoId({ message: CreateRentOfferValidationMessage.cityId.invalidId })
  public cityId: string;

  @IsArray({
    message: CreateRentOfferValidationMessage.images.invalidFormat
  })
  @MaxLength(256, {
    each: true,
    message: CreateRentOfferValidationMessage.image.maxLength
  })
  @ArrayMinSize(6, { message: CreateRentOfferValidationMessage.images.minSize })
  @ArrayMaxSize(6, { message: CreateRentOfferValidationMessage.images.maxSize })
  public images: string[];

  @IsBoolean({
    message: CreateRentOfferValidationMessage.premium.invalidFormat
  })
  public isPremium: boolean;

  @IsEnum(HouseType, { message: CreateRentOfferValidationMessage.type.invalid })
  public houseType: HouseType;

  @IsInt({ message: CreateRentOfferValidationMessage.rating.invalidFormat })
  @Min(1, { message: CreateRentOfferValidationMessage.rating.minValue })
  @Max(5, { message: CreateRentOfferValidationMessage.rating.maxValue })
  public rating: number;

  @IsInt({ message: CreateRentOfferValidationMessage.rooms.invalidFormat })
  @Min(1, { message: CreateRentOfferValidationMessage.rooms.minValue })
  @Max(8, { message: CreateRentOfferValidationMessage.rooms.maxValue })
  public rooms: number;

  @IsInt({ message: CreateRentOfferValidationMessage.guests.invalidFormat })
  @Min(1, { message: CreateRentOfferValidationMessage.guests.minValue })
  @Max(10, { message: CreateRentOfferValidationMessage.guests.maxValue })
  public guests: number;

  @IsInt({ message: CreateRentOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateRentOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateRentOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({
    message: CreateRentOfferValidationMessage.features.invalidFormat
  })
  @IsEnum(FeatureType, {
    each: true,
    message: CreateRentOfferValidationMessage.features.invalid
  })
  public features: FeatureType[];

  @IsLatitude({
    message: CreateRentOfferValidationMessage.latitude.invalidFormat
  })
  public latitude: number;

  @IsLongitude({
    message: CreateRentOfferValidationMessage.longitude.invalidFormat
  })
  public longitude: number;

  public userId: string;
}
