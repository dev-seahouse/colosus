import { StandardError } from '../../types';

const ERROR_MESSAGES = {
  NO_ACCOUNT_FOUND: 'Bank Account Not found for Tenant',
} as const;

export function hasNoAdvisorBankAccountFoundError(error: StandardError | null) {
  if (!error) return false;
  return error?.response?.data?.message?.includes(
    ERROR_MESSAGES.NO_ACCOUNT_FOUND
  );
}
