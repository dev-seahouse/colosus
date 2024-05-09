import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImageUpload from './ImageUpload';

describe('ImageUpload', () => {
  window.URL.createObjectURL = vi.fn();

  it('should allow user to upload an image', async () => {
    render(<ImageUpload />);

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    const imageUploader = screen.getByLabelText('upload image');

    await userEvent.upload(imageUploader, file);

    expect(screen.getByAltText('thumbnail')).toBeDefined();
  });
});
