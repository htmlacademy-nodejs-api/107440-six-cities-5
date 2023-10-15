import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByRentOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByRentOfferId(offerId: string): Promise<number | null>;
}
