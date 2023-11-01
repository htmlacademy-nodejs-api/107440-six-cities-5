import { inject, injectable } from 'inversify';
import { CommentService } from './comment.service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { MAX_COMMENTS_PER_OFFER } from './comment.constants.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(
    dto: CreateCommentDto
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByRentOfferId(
    rentOfferId: string
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ rentOfferId }, {}, { limit: MAX_COMMENTS_PER_OFFER })
      .sort({ createdAt: SortType.Down })
      .populate('userId');
  }

  public async deleteByRentOfferId(rentOfferId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ rentOfferId }).exec();

    return result.deletedCount;
  }
}
