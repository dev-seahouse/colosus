import DirectDebitGuaranteeBanner from './DirectDebitGuaranteeBanner';
import { render } from '@bambu/react-test-utils';

describe('DirectDebitGuaranteeBanner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DirectDebitGuaranteeBanner />);
    expect(baseElement).toBeTruthy();
  });
});
