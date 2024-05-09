import { ERROR_MESSAGES } from './Brokerage.enum';
import { StandardError } from '../../../types';

export function hasNoAccountFoundError(error: StandardError | null) {
  if (!error) return false;
  return error?.response?.data?.message?.includes(
    ERROR_MESSAGES.NO_ACCOUNTS_FOUND
  );
}
