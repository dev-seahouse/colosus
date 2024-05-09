import { DateTime } from 'luxon';

export const isValidISODate = (date: unknown) => {
  const maybeDate = DateTime.fromISO(date as string);
  if (!maybeDate.isValid) {
    return false;
  }
  return true;
};
