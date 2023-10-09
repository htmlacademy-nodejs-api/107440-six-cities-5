export enum UserType {
  Usual = 'Usual',
  Pro = 'Pro'
}

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  avatarPath: string;
  type: UserType;
};
