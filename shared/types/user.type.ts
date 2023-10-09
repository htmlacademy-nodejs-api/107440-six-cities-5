export enum UserType {
  Usual = 'Usual',
  Pro = 'Pro'
}

export type User = {
  firstName: string;
  lastName: string;
  emal: string;
  avatarPath: string;
  password: string;
  type: UserType;
};
