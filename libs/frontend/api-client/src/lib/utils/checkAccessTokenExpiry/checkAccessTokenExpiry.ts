import { DateTime } from 'luxon';

/**
 * returns true if access token is expired
 */
export const checkAccessTokenExpiry = (accessTokenExpiresAt: string) =>
  DateTime.fromISO(accessTokenExpiresAt).diffNow().as('milliseconds') < 0;

export default checkAccessTokenExpiry;
