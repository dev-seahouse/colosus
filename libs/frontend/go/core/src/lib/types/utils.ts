import { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// to be used with useLoaderData hook when data is loaded with react-query
export type ReactQueryLoaderData<T extends (...args: any) => any> = Awaited<
  ReturnType<ReturnType<T>>
>;

// merge types without losing type
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

// TODO: make it infer from select: passed in
export type QueryArgs<T, K = T, J extends QueryKey = any> = Omit<
  UseQueryOptions<
    T,
    AxiosError<{
      error: string;
      errorCode: string;
      message: string;
      requestId: string;
      statusCode: string;
    }>,
    K,
    J
  >,
  'queryKey' | 'QueryFn'
>;
