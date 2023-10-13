import { FeatureType, HouseType, RentOffer, User } from '../types/index.js';

export function createRentOffer(offerData: string): RentOffer {
  const [
    title,
    cityName,
    latitude,
    longitude,
    description,
    publishDate,
    preview,
    images,
    rating,
    guests,
    houseType,
    price,
    rooms,
    features,
    firstname,
    lastname,
    email,
    isPremium,
    isFavourite,
    avatarPath,
    userType,
    commentCount
  ] = offerData.replace('\n', '').split('\t');

  const author = {
    email,
    firstname,
    lastname,
    avatarPath,
    type: userType
  };

  return {
    title,
    description,
    preview,
    images,
    city: {
      name: cityName,
      latitude: Number.parseInt(latitude, 10),
      longitude: Number.parseInt(longitude, 10)
    },
    author: author as unknown as User,
    rating: Number.parseInt(rating, 10),
    guests: Number.parseInt(guests, 10),
    rooms: Number.parseInt(rooms, 10),
    isPremium: Boolean(isPremium),
    isFavourite: Boolean(isFavourite),
    publishDate: new Date(publishDate),
    houseType: HouseType[houseType as keyof typeof HouseType],
    features: features
      .split(',')
      .map((feature) => feature.trim()) as FeatureType[],
    price: Number.parseInt(price, 10),
    commentCount: Number.parseInt(commentCount, 10)
  };
}
