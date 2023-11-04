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
    firstName,
    lastName,
    email,
    isPremium,
    isFavorite,
    avatarPath,
    userType,
    commentCount,
    offerLatitude,
    offerLongitude
  ] = offerData.replace('\n', '').split('\t');

  const user = {
    email,
    firstName,
    lastName,
    avatarPath,
    type: userType
  };

  return {
    title,
    description,
    preview,
    images: images.split(','),
    city: {
      name: cityName,
      latitude: Number.parseInt(latitude, 10),
      longitude: Number.parseInt(longitude, 10)
    },
    user: user as unknown as User,
    rating: Number.parseInt(rating, 10),
    guests: Number.parseInt(guests, 10),
    rooms: Number.parseInt(rooms, 10),
    isPremium: Boolean(isPremium),
    isFavorite: Boolean(isFavorite),
    publishDate: new Date(publishDate),
    houseType: HouseType[houseType as keyof typeof HouseType],
    features: features
      .split(',')
      .map((feature) => feature.trim()) as FeatureType[],
    price: Number.parseInt(price, 10),
    commentCount: Number.parseInt(commentCount, 10),
    latitude: Number.parseInt(offerLatitude, 10),
    longitude: Number.parseInt(offerLongitude, 10)
  };
}
