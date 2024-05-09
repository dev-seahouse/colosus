import DirectDebitConfirmationPdfCallout from './DirectDebitConfirmationPdfCallout';
import { render } from '@bambu/react-test-utils';

describe('DirectDebitConfirmationPdfCallout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DirectDebitConfirmationPdfCallout
        toggleWpContactInfoDialogOpen={() => false}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
