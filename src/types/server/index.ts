export interface IResponse<T> {
  error?: string | number;
  data?: T;
}
