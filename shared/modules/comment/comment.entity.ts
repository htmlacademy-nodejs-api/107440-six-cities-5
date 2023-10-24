import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose';
import { RentOfferEntity } from '../rent-offer/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    validate: [
      {
        validator: (v: string) => v.length <= 5,
        message: 'Comment text is less than 5 characters!'
      },
      {
        validator: (v: string) => v.length >= 1024,
        message: 'Comment text is over 1024 characters!'
      }
    ]
  })
  public text: string;

  @prop({
    ref: RentOfferEntity,
    required: true
  })
  public rentOfferId: Ref<RentOfferEntity>;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
