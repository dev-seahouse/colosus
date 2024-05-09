import { render } from '@bambu/react-test-utils';
import VerifyAccountForm from './VerifyAccountForm';

describe('VerifyAccountForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VerifyAccountForm />);
    expect(baseElement).toBeTruthy();
  });
});
