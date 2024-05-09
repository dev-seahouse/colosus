import { AxiosError } from 'axios';

export type ErrorData = {
  error?: string;
  errorCode: string;
  message?: string;
  requestId: string;
  statusCode: string;
};
export type StandardError = AxiosError<ErrorData>;
