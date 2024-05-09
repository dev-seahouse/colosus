import { render } from '@bambu/react-test-utils';
import OpenInvestAccountAccordionSummary from './OpenInvestAccountAccordionSummary';

describe('OpenInvestAccountAccordionSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OpenInvestAccountAccordionSummary />);
    expect(baseElement).toBeTruthy();
  });
});
