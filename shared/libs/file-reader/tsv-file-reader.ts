import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { RentOffer, HouseType, FeatureType, User } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Partial<RentOffer>[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          publishDate,
          city,
          preview,
          images,
          isPremium,
          isFavourite,
          rating,
          houseType,
          rooms,
          guests,
          price,
          features,
          author,
          comments,
          latitude,
          longitude
        ]) => ({
          title,
          description,
          publishDate,
          city,
          preview,
          images,
          isPremium: Boolean(isPremium),
          isFavourite: Boolean(isFavourite),
          rating: Number.parseInt(rating, 10),
          houseType: HouseType[houseType as keyof typeof HouseType],
          rooms: Number.parseInt(rooms, 10),
          guests: Number.parseInt(guests, 10),
          features: features
            .split(',')
            .map(
              (feature) =>
                FeatureType[feature.trim() as keyof typeof FeatureType]
            ),
          author: author as unknown as User,
          comments: Number.parseInt(comments, 10),
          latitude: Number.parseInt(latitude, 10),
          longitude: Number.parseInt(longitude, 10),
          price: Number.parseInt(price, 10)
        })
      );
  }
}
