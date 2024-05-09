import DirectDebitConfirmBankDetailsCallout from './DirectDebitConfirmBankDetailsCallout';
import { render } from '@bambu/react-test-utils';

describe('DirectDebitConfirmBankDetailsCallout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DirectDebitConfirmBankDetailsCallout />);
    expect(baseElement).toBeTruthy();
  });
});
