export enum HouseType {
  Apartment = 'Apartment',
  House = 'House',
  Room = 'Room',
  Hotel = 'Hotel'
}

export enum FeatureType {
  Breakfast = 'Breakfast',
  AirCond = 'Air conditioning',
  Laptop = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge'
}

export type RentOffer = {
  title: string;
  description: string;
  publishDate: string;
  cityId: string;
  preview: string;
  images: string;
  isPremium: boolean;
  isFavourite: boolean;
  rating: number;
  houseType: HouseType;
  rooms: number;
  guests: number;
  price: number;
  features: FeatureType[];
  authorId: string;
  commentCount: number;
};
