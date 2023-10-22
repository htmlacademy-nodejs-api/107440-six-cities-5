import { Request } from 'express';
import { ParamRentOfferId } from '../types/param-rentOfferId.type.js';
import { UpdateRentOfferDto } from '../dto/update-rent-offer.dto.js';

export type UpdateRentOfferRequest = Request<
  ParamRentOfferId,
  unknown,
  UpdateRentOfferDto
>;
