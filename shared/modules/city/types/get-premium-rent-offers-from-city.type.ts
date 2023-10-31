import { Request } from 'express';
import { ParamCityId } from './param-cityId.type.js';

export type GetPremiumRentOffersFromCity = Request<
  ParamCityId,
  unknown,
  unknown
>;
