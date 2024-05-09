export class GoalType {
  id: string;
  name: string;
  description: string;
  sortKey: number;
  createdBy?: string = 'unknown';
  createdAt?: Date;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  updatedBy?: string = 'unknown';
  updatedAt?: Date;
}
