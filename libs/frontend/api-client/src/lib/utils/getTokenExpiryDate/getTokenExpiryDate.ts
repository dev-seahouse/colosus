import { DateTime } from 'luxon';

/**
 * returns token expire in date & time format
 */
export const getTokenExpiryDate = (expiresIn: number) =>
  DateTime.local().plus({ seconds: expiresIn }).toISO();

export default getTokenExpiryDate;
