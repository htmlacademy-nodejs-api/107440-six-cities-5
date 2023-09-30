import { FeatureType, HouseType, RentOffer, User } from '../types/index.js';

export function createRentOffer(offerData: string): Partial<RentOffer> {
  const [
    title,
    city,
    description,
    publishDate,
    preview,
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
    avatar
  ] = offerData.replace('\n', '').split('\t');

  const author = {
    email,
    firstname,
    lastname,
    avatar
  };

  return {
    title,
    description,
    preview,
    city,
    author: author as unknown as User,
    rating: Number.parseInt(rating, 10),
    guests: Number.parseInt(guests, 10),
    rooms: Number.parseInt(rooms, 10),
    isPremium: Boolean(isPremium),
    isFavourite: Boolean(isFavourite),
    publishDate,
    houseType: HouseType[houseType as keyof typeof HouseType],
    features: featureType
      .split(',')
      .map((feature) => feature.trim()) as FeatureType[],
    price: Number.parseInt(price, 10)
  };
}
