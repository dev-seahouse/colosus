import { render } from '@bambu/react-test-utils';
import GoAppLayout from './GoAppLayout';

describe('Go app layout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GoAppLayout />);
    expect(baseElement).toBeTruthy();
  });

  it('App bar should exist', () => {
    const { baseElement } = render(<GoAppLayout />);
    const appBar = baseElement.querySelector('#app-bar');
    expect(appBar).toBeTruthy();
  });
});
