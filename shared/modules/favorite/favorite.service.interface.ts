import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';

export interface FavoriteService {
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity> | null>;
  findFavoriteById(
    dto: CreateFavoriteDto
  ): Promise<DocumentType<FavoriteEntity> | null>;
  addToFavorite(
    dto: CreateFavoriteDto
  ): Promise<DocumentType<FavoriteEntity> | null>;
  removeFromFavorite(
    dto: CreateFavoriteDto
  ): Promise<DocumentType<FavoriteEntity> | null>;
  isFavorite(dto: CreateFavoriteDto): Promise<boolean>;
}
