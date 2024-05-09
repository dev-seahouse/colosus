export function getDayOfTheMonthSuffix(i: number) {
  let suffix = 'th';
  if (i === 1 || i === 21 || i === 31) {
    suffix = 'st';
  } else if (i === 2 || i === 22) {
    suffix = 'nd';
  } else if (i === 3 || i === 23) {
    suffix = 'rd';
  }
  return `${i}${suffix}`;
}
