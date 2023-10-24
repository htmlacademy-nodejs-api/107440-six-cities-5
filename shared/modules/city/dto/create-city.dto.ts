import { IsString, Length, IsLatitude, IsLongitude } from 'class-validator';
import { CreateCityMessages } from './create-city.messages.js';

export class CreateCityDto {
  @IsString({ message: CreateCityMessages.name.invalidFormat })
  @Length(4, 12, { message: CreateCityMessages.name.lengthField })
  public name: string;

  @IsLatitude({ message: CreateCityMessages.latitude.invalidFormat })
  public latitude: number;

  @IsLongitude({ message: CreateCityMessages.longitude.invalidFormat })
  public longitude: number;
}
