import { render } from '@bambu/react-test-utils';
import VerifyAccountPage from './VerifyAccountPage';

describe('VerifyAccountPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VerifyAccountPage />);
    expect(baseElement).toBeTruthy();
  });
});
