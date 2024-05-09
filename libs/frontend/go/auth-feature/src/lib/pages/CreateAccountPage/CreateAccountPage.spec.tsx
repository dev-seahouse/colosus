import { render } from '@bambu/react-test-utils';
import CreateAccountPage from './CreateAccountPage';

describe('CreateAccountPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateAccountPage />);
    expect(baseElement).toBeTruthy();
  });
});
