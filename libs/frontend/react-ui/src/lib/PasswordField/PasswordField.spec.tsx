import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
  it('should allow user to toggle between text & password', async () => {
    render(<PasswordField label="Password" />);

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    expect(passwordInput.type).toBe('password');

    await userEvent.click(screen.getByLabelText('Toggle password visibility'));

    expect(passwordInput.type).toBe('text');
  });
});
