import DirectDebitGuaranteeDialog from './DirectDebitGuaranteeDialog';
import { render } from '@bambu/react-test-utils';

describe('DirectDebitGuaranteeDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DirectDebitGuaranteeDialog open={false} onClose={() => undefined} />
    );
    expect(baseElement).toBeTruthy();
  });
});
