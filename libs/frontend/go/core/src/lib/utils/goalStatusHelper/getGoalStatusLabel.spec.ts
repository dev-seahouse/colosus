import { GoalStatusEnum } from '@bambu/shared';
import { getGoalStatusLabel } from './getGoalStatusLabel';

describe('getGoalStatusLabel', () => {
  it('should return the correct label for a known status', () => {
    expect(getGoalStatusLabel(GoalStatusEnum.PENDING)).toBe('Inactive');
    expect(getGoalStatusLabel(GoalStatusEnum.CREATED)).toBe('In Progress');
    expect(getGoalStatusLabel(GoalStatusEnum.ACTIVE)).toBe('Active');
    expect(getGoalStatusLabel(GoalStatusEnum.CLOSED)).toBe('Closed');
    expect(getGoalStatusLabel(GoalStatusEnum.CLOSING)).toBe('Closing');
  });

  it('should return the "Unknown" label for an unknown status', () => {
    expect(getGoalStatusLabel('UNKNOWN' as GoalStatusEnum)).toBe('Unknown');
  });

  it('should log an error for an unknown status', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    getGoalStatusLabel('INVALID_STATUS' as GoalStatusEnum);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unknown goal status: ',
      'INVALID_STATUS'
    );
    consoleErrorSpy.mockRestore();
  });
});
