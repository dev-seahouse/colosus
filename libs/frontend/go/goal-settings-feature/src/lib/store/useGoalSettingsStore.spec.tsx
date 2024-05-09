import { act, renderHook } from '@bambu/react-test-utils';

import useGoalSettingsStore from './useGoalSettingsStore';

describe('useGoalSettingsStore', () => {
  describe('growMyWealthSlice', () => {
    it('should be able to update gmw goal data', () => {
      const { result } = renderHook(() => useGoalSettingsStore());

      act(() =>
        result.current.growMyWealth.updateGrowMyWealthData({
          goalYear: 2033,
        })
      );

      expect(result.current.growMyWealth.goalYear).toEqual(2033);
    });
  });

  describe('retirementSlice', () => {
    it('should be able to update retirement goal data', () => {
      const { result } = renderHook(() => useGoalSettingsStore());

      act(() =>
        result.current.retirement.updateRetirementData({
          retirementAge: 55,
        })
      );

      expect(result.current.retirement.retirementAge).toEqual(55);
    });
  });

  describe('educationSlice', () => {
    it('should be able to update education goal data', () => {
      const { result } = renderHook(() => useGoalSettingsStore());

      act(() =>
        result.current.education.updateEducationData({
          collegeFees: 5500,
        })
      );

      expect(result.current.education.collegeFees).toEqual(5500);
    });
  });

  describe('otherSlice', () => {
    it('should be able to update other goal data', () => {
      const { result } = renderHook(() => useGoalSettingsStore());

      act(() =>
        result.current.other.updateOtherData({
          goalValue: 10000,
        })
      );

      expect(result.current.other.goalValue).toEqual(10000);
    });
  });

  describe('houseSlice', () => {
    it('should be able to update house goal data', () => {
      const { result } = renderHook(() => useGoalSettingsStore());

      act(() =>
        result.current.house.updateHouseData({
          housePrice: 10000,
        })
      );

      expect(result.current.house.housePrice).toEqual(10000);
    });
  });
});
