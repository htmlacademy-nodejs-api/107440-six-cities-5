import { User } from './user.type.js';

export type Comment = {
  text: string;
  publishDate: string;
  rating: string;
  author: User;
};
