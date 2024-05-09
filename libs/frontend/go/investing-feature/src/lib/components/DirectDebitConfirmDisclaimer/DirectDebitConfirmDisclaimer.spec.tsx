import DirectDebitConfirmDisclaimer from './DirectDebitConfirmDisclaimer';
import { render } from '@bambu/react-test-utils';

describe('DirectDebitConfirmDisclaimer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DirectDebitConfirmDisclaimer />);
    expect(baseElement).toBeTruthy();
  });
});
