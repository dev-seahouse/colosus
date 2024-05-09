import { render } from '@bambu/react-test-utils';

import LoginLink from './LoginLink';

describe('LoginLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoginLink />);
    expect(baseElement).toBeTruthy();
  });
});
