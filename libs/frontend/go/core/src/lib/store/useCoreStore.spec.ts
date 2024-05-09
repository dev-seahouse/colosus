import { renderHook, act } from '@bambu/react-test-utils';
import useCoreStore from './useCoreStore';

describe('useCoreStore', () => {
  describe('setProgress', () => {
    it('should be able to update progress', () => {
      const { result } = renderHook(() => useCoreStore());

      act(() => result.current.layout.setProgress(50));

      expect(result.current.layout.progress).toEqual(50);
    });
  });

  describe('setShowBackButton', () => {
    it('should be able to update showBackButton', () => {
      const { result } = renderHook(() => useCoreStore());

      act(() => result.current.layout.setShowBackButton(true));

      expect(result.current.layout.showBackButton).toEqual(true);
    });
  });

  describe('resetLayoutState', () => {
    it('should be able to reset layout state', () => {
      const { result } = renderHook(() => useCoreStore());

      act(() => result.current.layout.setProgress(50));
      act(() => result.current.layout.setShowBackButton(true));
      act(() => result.current.layout.resetLayoutState());

      expect(result.current.layout.progress).toEqual(25);
      expect(result.current.layout.showBackButton).toEqual(false);
    });
  });

  describe('setUserData', () => {
    it('should be able to update user data', () => {
      const { result } = renderHook(() => useCoreStore());

      act(() => result.current.setUserData({ zipCode: '12345' }));

      expect(result.current.zipCode).toEqual('12345');
    });
  });

  describe('updateGoalData', () => {
    it('should be able to update user goal data', () => {
      const { result } = renderHook(() => useCoreStore());

      act(() => result.current.goal.updateGoalData({ goalValue: 12000 }));

      expect(result.current.goal.goalValue).toEqual(12000);
    });
  });

  describe('updateProjectedReturnData', () => {
    it('should be able to update user goal projected return data', () => {
      const { result } = renderHook(() => useCoreStore());

      act(() =>
        result.current.goal.updateProjectedReturnData({
          target: 100,
          high: 200,
          low: 50,
        })
      );

      expect(result.current.goal.projectedReturns.target).toEqual(100);
      expect(result.current.goal.projectedReturns.low).toEqual(50);
      expect(result.current.goal.projectedReturns.high).toEqual(200);
    });
  });
});
