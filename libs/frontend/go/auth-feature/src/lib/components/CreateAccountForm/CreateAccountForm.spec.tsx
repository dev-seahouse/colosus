import { render } from '@bambu/react-test-utils';
import CreateAccountForm from './CreateAccountForm';

describe('CreateAccountForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateAccountForm />);
    expect(baseElement).toBeTruthy();
  });
});
