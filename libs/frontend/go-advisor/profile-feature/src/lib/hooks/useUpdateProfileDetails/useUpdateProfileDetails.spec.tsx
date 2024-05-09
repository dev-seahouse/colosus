import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useUpdateProfileDetails from './useUpdateProfileDetails';

const mockOnSuccess = vi.fn();

describe('useUpdateProfileDetails', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(
      () =>
        useUpdateProfileDetails({
          onSuccess: () => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        businessName: 'Bambu',
        countryOfResidence: 'USA',
        jobTitle: 'Software Engineer',
        firstName: 'Matius',
        lastName: 'The Ben Slayer',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
