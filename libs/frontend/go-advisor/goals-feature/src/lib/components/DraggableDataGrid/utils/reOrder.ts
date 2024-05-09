/**
 * given an array, move element from 'startindex' to 'endIndex'
 * @param list the array to modify
 * @param startIndex index of item to move from
 * @param endIndex index of item to move to
 * @returns new result
 */
export function reOrder<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
