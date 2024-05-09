import { useForm } from 'react-hook-form';
import RHFRadioGroupControl from './RHFRadioGroupControl';
import { render, renderHook } from '@bambu/react-test-utils';
describe('RHFRadioGroupControl', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useForm<{ hi: boolean }>());

    const { baseElement } = render(
      <RHFRadioGroupControl
        control={result.current.control}
        radios={[
          {
            label: 'hi',
            value: true,
          },
        ]}
        label={'hello'}
        name={'hi'}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
