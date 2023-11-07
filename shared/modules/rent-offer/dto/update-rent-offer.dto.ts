import {
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  IsArray,
  IsBoolean,
  MinLength,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';
import { UpdateRentOfferMessage } from './update-rent-offer.messages.js';
import { HouseType, FeatureType } from '../../../types/index.js';
import { MAX_OFFER_IMAGES } from '../rent-offer.constants.js';

export class UpdateRentOfferDto {
  @IsOptional()
  @MinLength(10, { message: UpdateRentOfferMessage.title.minLength })
  @MaxLength(100, { message: UpdateRentOfferMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: UpdateRentOfferMessage.description.minLength })
  @MaxLength(1024, {
    message: UpdateRentOfferMessage.description.maxLength
  })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: UpdateRentOfferMessage.postDate.invalidFormat })
  public publishDate?: Date;

  @IsOptional()
  @IsMongoId({ message: UpdateRentOfferMessage.cityId.invalidId })
  public cityId?: string;

  @IsOptional()
  @IsString({ message: UpdateRentOfferMessage.image.invalidFormat })
  @MaxLength(256, { message: UpdateRentOfferMessage.image.maxLength })
  public preview?: string;

  @IsOptional()
  @IsArray({
    message: UpdateRentOfferMessage.images.invalidFormat
  })
  @ArrayMinSize(MAX_OFFER_IMAGES, {
    message: UpdateRentOfferMessage.images.limit
  })
  @ArrayMaxSize(MAX_OFFER_IMAGES, {
    message: UpdateRentOfferMessage.images.limit
  })
  @MaxLength(256, {
    each: true,
    message: UpdateRentOfferMessage.image.maxLength
  })
  public images?: string[];

  @IsOptional()
  @IsBoolean({
    message: UpdateRentOfferMessage.premium.invalidFormat
  })
  public isPremium?: boolean;

  @IsOptional()
  @IsInt({ message: UpdateRentOfferMessage.rating.invalidFormat })
  @Min(1, { message: UpdateRentOfferMessage.rating.minValue })
  @Max(5, { message: UpdateRentOfferMessage.rating.maxValue })
  public rating?: number;

  @IsOptional()
  @IsEnum(HouseType, { message: UpdateRentOfferMessage.type.invalid })
  public houseType?: HouseType;

  @IsOptional()
  @IsInt({ message: UpdateRentOfferMessage.rooms.invalidFormat })
  @Min(1, { message: UpdateRentOfferMessage.rooms.minValue })
  @Max(8, { message: UpdateRentOfferMessage.rooms.maxValue })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: UpdateRentOfferMessage.guests.invalidFormat })
  @Min(1, { message: UpdateRentOfferMessage.guests.minValue })
  @Max(10, { message: UpdateRentOfferMessage.guests.maxValue })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: UpdateRentOfferMessage.price.invalidFormat })
  @Min(100, { message: UpdateRentOfferMessage.price.minValue })
  @Max(100000, { message: UpdateRentOfferMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({
    message: UpdateRentOfferMessage.features.invalidFormat
  })
  @IsEnum(HouseType, {
    each: true,
    message: UpdateRentOfferMessage.features.invalid
  })
  public features?: FeatureType[];
}
