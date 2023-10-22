import { Request } from 'express';
import { RequestQuery } from '../../../libs/rest/index.js';
import { ParamCityId } from './param-cityId.type.js';

export type GetRentOffersFromCity = Request<
  ParamCityId,
  unknown,
  unknown,
  RequestQuery
>;
