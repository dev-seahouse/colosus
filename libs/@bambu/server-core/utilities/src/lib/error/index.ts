import { SharedEnums } from '@bambu/shared';
import { HttpException, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

export type ErrorCodes =
  | SharedEnums.ErrorCodes.GenericErrorCodesEnum
  | SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum
  | SharedEnums.ErrorCodes.BrandingAndSubdomainErrorCodesEnum
  | SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum;

export class ColossusError extends Error {
  public readonly requestId: string;
  public readonly statusCode: number;
  public readonly metadata: Record<string, unknown> | unknown | null;
  public readonly colossusErrorCode: ErrorCodes;

  constructor(
    message: string,
    requestId: string,
    metadata: Record<string, unknown> | unknown | null = null,
    statusCode = 500,
    colossusErrorCode: ErrorCodes = SharedEnums.ErrorCodes.GenericErrorCodesEnum
      .UNHANDLED
  ) {
    super(message);
    this.requestId = requestId;
    this.metadata = metadata;
    this.statusCode = statusCode;
    this.colossusErrorCode = colossusErrorCode;
  }
}

export function getDefaultInvalidCredentialsError(
  requestId: string,
  metadata: Record<string, unknown> | null = null
) {
  return new ColossusError(
    'Invalid credentials.',
    requestId,
    metadata,
    401,
    SharedEnums.ErrorCodes.GenericErrorCodesEnum.INVALID_CREDENTIALS
  );
}

export function getDefaultMissingTenantInDbErrorWithTenantId({
  requestId = 'N/A',
  metadata = null,
  tenantId,
}: {
  requestId?: string;
  metadata?: Record<string, unknown> | null;
  tenantId: string;
}) {
  const errorMetadata: Record<string, unknown> = { tenantId };

  if (metadata) {
    Object.keys(metadata).forEach((key) => {
      errorMetadata[key] = metadata[key] as unknown;
    });
  }

  return getDefaultMissingTenantInDbError({
    requestId,
    metadata: errorMetadata,
    errorMessage: `Tenant not found for tenant id (${tenantId}).`,
  });
}

export function getDefaultMissingTenantInDbError({
  requestId = 'N/A',
  errorMessage = `Tenant cannot be found in DB.`,
  metadata = null,
}: {
  requestId?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown> | null;
}) {
  return new ColossusError(
    errorMessage,
    requestId,
    metadata,
    500,
    SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
  );
}

export function getDefaultMissingClaimsError(
  requestId = 'N/A',
  metadata: Record<string, unknown> | null = null,
  errorMessage: string = [
    `Error while binding identity claims to request.`,
    `Please check access token and access binding.`,
  ].join(' ')
) {
  return new ColossusError(
    errorMessage,
    requestId,
    metadata,
    500,
    SharedEnums.ErrorCodes.GenericErrorCodesEnum.INVALID_SESSION_CLAIMS
  );
}

export function getDefaultTenantAccessTokenMissingError(
  requestId: string,
  tenantId: string
) {
  return new ColossusError(
    `Tenant access token missing for tenant.`,
    requestId,
    { tenantId },
    400,
    SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.AUTHENTICATION_TOKEN_MISSING
  );
}

export function getDefaultBrokerageApiRateLimitError(
  requestId: string,
  metadata: unknown
): ColossusError {
  return new ColossusError(
    `Brokerage API rate limit met/exceeded.`,
    requestId,
    metadata,
    429,
    SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BROKER_API_RATE_LIMIT_HIT
  );
}

export function generateHttpControllerError(error: Error) {
  if (error instanceof ColossusError) {
    const { name, colossusErrorCode, statusCode, message, requestId } = error;
    return new HttpException(
      {
        error: name,
        errorCode: colossusErrorCode,
        statusCode,
        message,
        requestId,
      },
      error.statusCode,
      {
        cause: error,
      }
    );
  }

  const errorMessage = error?.message || 'Internal Server Error';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusCode = (error as any)?.statusCode || 500;

  return new HttpException(
    {
      error: 'Error',
      errorCode: SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED,
      statusCode,
      message: errorMessage,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestId: (error as any)?.requestId || 'N/A',
    },
    500,
    {
      cause: error,
    }
  );
}

export function handleHttpControllerError(error: Error, requestId?: string) {
  if (requestId && error) {
    Object.assign(error, { requestId });
  }

  throw generateHttpControllerError(error);
}

export function isErrorFromAxios(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError;
}

export function castErrorAsAxiosError(error: unknown): AxiosError {
  if (isErrorFromAxios(error)) {
    return error as AxiosError;
  }

  throw new Error('Error is not an AxiosError.');
}

export async function exponentialBackoff<T>(
  logger: Logger,
  fn: () => Promise<T>,
  retries = 5,
  delay = 500,
  errorCodes: ErrorCodes[] = [],
  httpStatusCodes: number[] = [429]
): Promise<T> {
  let attempts = 0;
  let caughtError: unknown = null;

  while (attempts < retries) {
    try {
      return await fn();
    } catch (error: unknown) {
      caughtError = error;
      const isAxiosError = isErrorFromAxios(error);
      const isColossusError = error instanceof ColossusError;

      if (
        (isAxiosError &&
          httpStatusCodes.includes(
            (error as AxiosError).response?.status ?? -1
          )) ||
        (isColossusError && errorCodes.includes(error.colossusErrorCode)) ||
        /**
         * This is a workaround for the WK API returning ECONNREFUSED intermittently.
         * Probably not the best idea to do this, but it's a quick fix for now.
         */
        (isAxiosError &&
          (
            castErrorAsAxiosError(error)?.cause as unknown as Record<
              string,
              unknown
            >
          )?.code === 'ECONNREFUSED')
      ) {
        attempts += 1;
        logger.log(`Attempt ${attempts} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }

  throw caughtError as Error;
}
