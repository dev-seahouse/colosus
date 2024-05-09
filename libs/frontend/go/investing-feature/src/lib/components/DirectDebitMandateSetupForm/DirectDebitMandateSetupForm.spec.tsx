import DirectDebitMandateSetupForm from './DirectDebitMandateSetupForm';
import { render } from '@bambu/react-test-utils';

describe('DirectDebitMandateSetupForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DirectDebitMandateSetupForm />);
    expect(baseElement).toBeTruthy();
  });
});
