import { render } from '@bambu/react-test-utils';

import UploadAdvisorPictureButton from './UploadAdvisorPictureButton';

describe('UploadAdvisorPictureButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UploadAdvisorPictureButton />);
    expect(baseElement).toBeTruthy();
  });
});
