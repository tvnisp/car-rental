export interface IResponse<T> {
  error?: string | number | Array<string>;
  data?: T;
}

export type ISessionUser = {
  accessToken: string;
  email: string;
  exp: number;
  iat: number;
  id: string;
  jti: string;
  name: string;
  role: string;
  sub: string;
};

export interface IDecodedJWTUser {
  id: string;
  name: string;
  iat: number;
  exp: number;
}
