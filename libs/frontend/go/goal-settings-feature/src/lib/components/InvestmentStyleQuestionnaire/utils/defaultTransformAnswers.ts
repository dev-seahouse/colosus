import type { IAnswer } from '@bambu/shared';

export const defaultTransformAnswers = (answers: IAnswer[]) =>
  answers.map((i) => ({
    ...i,
    title: '',
    description: i.answer,
  }));

export default defaultTransformAnswers;
