import { render } from '@bambu/react-test-utils';
import AuthFeature from './AuthFeature';

describe('AuthFeature', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthFeature />);
    expect(baseElement).toBeTruthy();
  });
});
