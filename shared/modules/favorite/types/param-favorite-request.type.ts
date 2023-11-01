import { ParamsDictionary } from 'express-serve-static-core';

export type ParamFavoriteReq =
  | {
      rentOfferId: string;
      userId: string;
    }
  | ParamsDictionary;
