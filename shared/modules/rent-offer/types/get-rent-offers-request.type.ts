import { Request } from 'express';
import { RequestQuery } from '../../../libs/rest/index.js';

export type GetRentOffers = Request<unknown, unknown, unknown, RequestQuery>;
