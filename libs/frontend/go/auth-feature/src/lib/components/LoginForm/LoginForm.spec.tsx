import React from 'react';
import LoginForm from './LoginForm';
import { render } from '@bambu/react-test-utils';

describe('LoginForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoginForm />);
    expect(baseElement).toBeTruthy();
  });
});
