import { CreateRentOfferDto } from './dto/create-rent-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { RentOfferEntity } from './rent-offer.entity.js';
import { UpdateRentOfferDto } from './dto/update-rent-offer.dto.js';

export interface RentOfferService {
  create(dto: CreateRentOfferDto): Promise<DocumentType<RentOfferEntity>>;
  findById(offerId: string): Promise<DocumentType<RentOfferEntity> | null>;
  find(): Promise<DocumentType<RentOfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<RentOfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateRentOfferDto
  ): Promise<DocumentType<RentOfferEntity> | null>;
  findByCityId(
    cityId: string,
    count?: number
  ): Promise<DocumentType<RentOfferEntity>[]>;
  incCommentCount(
    offerId: string
  ): Promise<DocumentType<RentOfferEntity> | null>;
  findNew(count: number): Promise<DocumentType<RentOfferEntity>[]>;
  findDiscussed(count: number): Promise<DocumentType<RentOfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
}
