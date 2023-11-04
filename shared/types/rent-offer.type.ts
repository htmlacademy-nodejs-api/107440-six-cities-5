import { City, User } from './index.js';

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
  publishDate: Date;
  city: City;
  preview: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  houseType: HouseType;
  rooms: number;
  guests: number;
  price: number;
  features: FeatureType[];
  user: User;
  commentCount: number;
  latitude: number;
  longitude: number;
};
