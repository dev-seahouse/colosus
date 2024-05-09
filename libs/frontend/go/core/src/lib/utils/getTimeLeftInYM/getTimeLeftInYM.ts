import { DateTime } from 'luxon';

export function getTimeLeftInYM(targetDate: string): string | number {
  const currentDate = DateTime.now();
  const targetDateLuxon = DateTime.fromISO(targetDate);

  if (targetDateLuxon < currentDate) {
    return 0;
  }

  const { years, months } = targetDateLuxon
    .diff(currentDate)
    .shiftTo('years', 'months');

  if (years === 0 && Math.floor(months) === 0) {
    return 0;
  } else if (Math.floor(months) === 0) {
    return `${years}y`;
  } else {
    return `${years}y ${Math.floor(months)}mo`;
  }
}
