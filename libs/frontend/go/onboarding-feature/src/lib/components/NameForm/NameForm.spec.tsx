import { render, screen, userEvent } from '@bambu/react-test-utils';
import NameForm from './NameForm';

async function enterName(name = 'John') {
  const nameInput = screen.getByLabelText(/Name/i);

  await userEvent.type(nameInput, name);
}

async function submitNameform() {
  await userEvent.click(screen.getByRole('button', { name: 'Next' }));
}

describe('NameForm', () => {
  beforeEach(() => {
    render(<NameForm />);
  });

  it('should display error if name is empty', async () => {
    await submitNameform();
    expect(screen.getByText(/your name is required/i)).toBeDefined();
  });

  it('should display error if user name contains number', async () => {
    await enterName('John123');
    await submitNameform();
    expect(
      screen.getByText(/name should contain only alphabets/i)
    ).toBeDefined();
  });

  it('should display error if user name contains special character', async () => {
    await enterName('John@');
    await submitNameform();
    expect(
      screen.getByText(/name should contain only alphabets/i)
    ).toBeDefined();
  });

  it('should allow the user to submit if name is valid', async () => {
    await enterName();
    await submitNameform();
    expect(screen.queryByText(/your name is required/i)).toBeNull();
  });
});
