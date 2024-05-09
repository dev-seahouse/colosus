import { isValidISODate } from '../isValidISODate/isValidISODate';

export function getValidDateOrFallBack(date: unknown, fallback: string) {
  if (!isValidISODate(date)) {
    return fallback;
  }
  return date as string;
}
