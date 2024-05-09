import React from 'react';
import { render, renderHook } from '@testing-library/react';
import PlatformTermsConditionCheckbox from './PlatformTermsConditionCheckbox';
import { queryClientWrapper } from '@bambu/react-test-utils';
import { useForm } from 'react-hook-form';

describe('PlatformTermsConditionCheckbox', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useForm<{ hi: boolean }>());

    const { baseElement } = render(
      <div>
        <PlatformTermsConditionCheckbox
          name="hi"
          control={result.current.control}
        />
        ,
      </div>,
      {
        wrapper: queryClientWrapper,
      }
    );
    expect(baseElement).toBeTruthy();
  });
});
