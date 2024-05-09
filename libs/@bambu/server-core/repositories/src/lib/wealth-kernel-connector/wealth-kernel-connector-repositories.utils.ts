import { ErrorUtils, JsonUtils } from '@bambu/server-core/utilities';

export function handleWealthKernelConnectorError(
  error: unknown,
  requestId: string
): Error | ErrorUtils.ColossusError {
  if (!ErrorUtils.isErrorFromAxios(error)) {
    return error as Error;
  }

  const axiosError = ErrorUtils.castErrorAsAxiosError(error);
  const responseData = axiosError.response?.data as Record<string, unknown>;

  if (
    responseData?.statusCode &&
    responseData?.errorCode &&
    responseData?.message
  ) {
    return new ErrorUtils.ColossusError(
      responseData?.message as string,
      requestId,
      JSON.parse(JsonUtils.Stringify(error)),
      axiosError.status,
      // eslint-disable-next-line
      responseData.errorCode as any
    );
  }

  return error as Error;
}
