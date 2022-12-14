export type User = {
  id: string,
  email: string,
  displayName: string,
  profileUrl: string,
};

export enum AuthProvider {
  SELF = 'SELF',
  GOOGLE = 'GOOGLE',
}

export type Owner = {
  id: string,
  displayName: string,
};
