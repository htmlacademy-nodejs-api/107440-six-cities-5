export enum UserType {
  Usual = 'Usual',
  Pro = 'Pro'
}

export type User = {
  name: string;
  emal: string;
  avatar: string;
  password: string;
  type: UserType;
};
