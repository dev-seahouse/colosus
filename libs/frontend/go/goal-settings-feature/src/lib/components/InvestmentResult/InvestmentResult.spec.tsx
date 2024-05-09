import { render } from '@bambu/react-test-utils';
import InvestmentResult from './InvestmentResult';

describe('InvestmentResult', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InvestmentResult />);
    expect(baseElement).toBeTruthy();
  });
});
