import type { IAnswer } from '@bambu/shared';

export function sortListOrder(answerArray: IAnswer[]) {
  return answerArray.sort((a, b) => b.sortKey - a.sortKey);
}
