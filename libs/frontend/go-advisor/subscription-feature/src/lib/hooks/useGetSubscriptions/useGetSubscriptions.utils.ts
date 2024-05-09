import { DateTime } from 'luxon';

export const convertUnixToDate = (unix: number, format = 'd LLLL yyyy') => {
  return DateTime.fromSeconds(unix).toFormat(format);
};
