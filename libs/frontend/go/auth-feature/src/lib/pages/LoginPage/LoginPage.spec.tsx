import { render } from '@bambu/react-test-utils';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoginPage />);
    expect(baseElement).toBeTruthy();
  });
});
