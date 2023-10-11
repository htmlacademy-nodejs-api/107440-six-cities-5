import { UserType } from '../../../types/user.type.js';

export class CreateUserDto {
  public email: string;
  public avatarPath: string;
  public firstName: string;
  public lastName: string;
  public password: string;
  public type: UserType;
}
