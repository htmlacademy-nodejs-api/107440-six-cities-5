import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { UpdateRentOfferDto } from './dto/update-rent-offer.dto.js';
import { DocumentExists } from '../../types/index.js';

export interface RentOfferService extends DocumentExists {
  create(dto: CreateRentOfferDto): Promise<DocumentType<RentOfferEntity>>;
  findById(offerId: string): Promise<DocumentType<RentOfferEntity> | null>;
  find(count?: number): Promise<DocumentType<RentOfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<RentOfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateRentOfferDto
  ): Promise<DocumentType<RentOfferEntity> | null>;
  findByCityId(
    cityId: string,
    count?: number
  ): Promise<DocumentType<RentOfferEntity>[]>;
  findPremiumByCityId(
    cityId: string,
    count?: number
  ): Promise<DocumentType<RentOfferEntity>[]>;
  incCommentCount(
    offerId: string
  ): Promise<DocumentType<RentOfferEntity> | null>;
  findNew(count: number): Promise<DocumentType<RentOfferEntity>[]>;
  findDiscussed(count: number): Promise<DocumentType<RentOfferEntity>[]>;
}
