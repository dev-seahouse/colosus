import { DateTime } from 'luxon';
import { isValidISODate } from '../isValidISODate/isValidISODate';

export function formatIsoAsYYYYMM(iso: unknown) {
  if (!isValidISODate(iso)) return null;
  const dt = DateTime.fromISO(iso as string);
  return dt.toFormat('yyyy-MM');
}

export default formatIsoAsYYYYMM;
