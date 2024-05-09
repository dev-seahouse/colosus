import { render } from '@bambu/react-test-utils';
import RiskMeter from './RiskMeter';

describe('RiskMeter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RiskMeter />);
    expect(baseElement).toBeTruthy();
  });
});
