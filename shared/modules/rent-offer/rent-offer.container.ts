import { Container } from 'inversify';
import { RentOfferService } from './rent-offer.service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultRentOfferService } from './rent-offer.service.js';
import { RentOfferEntity, RentOfferModel } from './rent-offer.entity.js';
import { types } from '@typegoose/typegoose';

export function createRentOfferContainer() {
  const rentOfferContainer = new Container();

  rentOfferContainer
    .bind<RentOfferService>(Component.RentOfferService)
    .to(DefaultRentOfferService);
  rentOfferContainer
    .bind<types.ModelType<RentOfferEntity>>(Component.RentOfferModel)
    .toConstantValue(RentOfferModel);

  return rentOfferContainer;
}
