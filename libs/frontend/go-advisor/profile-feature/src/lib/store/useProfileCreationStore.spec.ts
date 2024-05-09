import { renderHook, act } from '@bambu/react-test-utils';
import useProfileCreationStore from './useProfileCreationStore';
import { describe } from 'vitest';

describe('useProfileCreationStore', () => {
  describe('setAdvisorDetails', () => {
    it('should be able to update firstName', () => {
      const { result } = renderHook(() => useProfileCreationStore());

      act(() => result.current.setAdvisorDetails({ firstName: 'Matius' }));

      expect(result.current.firstName).toEqual('Matius');
    });

    it('should be able to update lastName', () => {
      const { result } = renderHook(() => useProfileCreationStore());

      act(() => result.current.setAdvisorDetails({ lastName: 'Bambu' }));

      expect(result.current.lastName).toEqual('Bambu');
    });

    it('should be able to update finra', () => {
      const { result } = renderHook(() => useProfileCreationStore());

      act(() => result.current.setAdvisorDetails({ finra: '123456' }));

      expect(result.current.finra).toEqual('123456');
    });

    it('should be able to update jobTitle', () => {
      const { result } = renderHook(() => useProfileCreationStore());

      act(() => result.current.setAdvisorDetails({ jobTitle: 'advisor' }));

      expect(result.current.jobTitle).toEqual('advisor');
    });

    it('should be able to update country', () => {
      const { result } = renderHook(() => useProfileCreationStore());

      act(() => result.current.setAdvisorDetails({ countryOfResidence: 'US' }));

      expect(result.current.countryOfResidence).toEqual('US');
    });
  });

  describe('setProgress', () => {
    it('should be able to update progress', () => {
      const { result } = renderHook(() => useProfileCreationStore());

      act(() => result.current.layout.setProgress(50));

      expect(result.current.layout.progress).toEqual(50);
    });
  });

  describe('setShowBackButton', () => {
    it('should be able to update showBackButton', () => {
      const { result } = renderHook(() => useProfileCreationStore());

      act(() => result.current.layout.setShowBackButton(true));

      expect(result.current.layout.showBackButton).toEqual(true);
    });
  });

  describe('resetLayoutState', () => {
    it('should be able to reset layout state', () => {
      const { result } = renderHook(() => useProfileCreationStore());

      act(() => result.current.layout.setProgress(50));
      act(() => result.current.layout.setShowBackButton(true));
      act(() => result.current.layout.resetLayoutState());

      expect(result.current.layout.progress).toEqual(25);
      expect(result.current.layout.showBackButton).toEqual(false);
    });
  });
});
