import { render } from '@bambu/react-test-utils';

import DownPaymentForm from './DownPaymentForm';

describe('DownPaymentForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DownPaymentForm />);
    expect(baseElement).toBeTruthy();
  });
});
