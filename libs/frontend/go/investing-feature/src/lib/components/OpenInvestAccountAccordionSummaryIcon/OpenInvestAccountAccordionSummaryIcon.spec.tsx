import OpenInvestAccountAccordionSummaryIcon from './OpenInvestAccountAccordionSummaryIcon';
import { render } from '@bambu/react-test-utils';

describe('OpenInvestAccountAccordionSummaryIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <OpenInvestAccountAccordionSummaryIcon
        isTouched={false}
        hasError={true}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
