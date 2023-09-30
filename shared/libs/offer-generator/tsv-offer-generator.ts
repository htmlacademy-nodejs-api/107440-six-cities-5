import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, HouseType, FeatureType } from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems
} from '../../helpers/index.js';

const MIN_PRICE = 10;
const MAX_PRICE = 10000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const BOOLEAN_STATES = [true, false];

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const city = getRandomItem<string>(this.mockData.cities);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const photo = getRandomItem<string>(this.mockData.previewImages);
    const featureType = getRandomItems<string>([
      FeatureType.AirCond,
      FeatureType.BabySeat,
      FeatureType.Breakfast,
      FeatureType.Fridge,
      FeatureType.Laptop,
      FeatureType.Towels,
      FeatureType.Washer
    ]);
    const houseType = getRandomItem<string>([
      HouseType.Apartment,
      HouseType.Hotel,
      HouseType.House,
      HouseType.Room
    ]);
    const isPremium = getRandomItem<boolean>(BOOLEAN_STATES);
    const isFavourite = getRandomItem<boolean>(BOOLEAN_STATES);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const author = getRandomItem<string>(this.mockData.authors);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const comments = generateRandomValue(0, 50);
    const latitude = generateRandomValue(0, 50, 10);
    const longitude = generateRandomValue(0, 50, 10);

    const publishedDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const [firstname, lastname] = author.split(' ');

    return [
      title,
      city,
      description,
      publishedDate,
      photo,
      rating,
      guests,
      houseType,
      price,
      rooms,
      featureType,
      firstname,
      lastname,
      email,
      isPremium,
      isFavourite,
      avatar,
      comments,
      latitude,
      longitude
    ].join('\t');
  }
}
