import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ColorPicker from './ColorPicker';

const openColorPicker = async () => {
  const colorPickerBtn = screen.getByRole('button', {
    name: 'color-picker-btn',
  });

  await userEvent.click(colorPickerBtn);
};

describe('ColorPicker', () => {
  beforeEach(() => {
    render(<ColorPicker aria-label="color-picker-btn" />);
  });

  it('should be able to open color picker', async () => {
    await openColorPicker();
    const colorPickerPopover = screen.getByRole('presentation');

    expect(colorPickerPopover).toBeDefined();
  });

  // it('should be able to change color', async () => {
  //   await openColorPicker();
  //
  //   const colorPickerInput = screen.getByRole('textbox');
  //
  //   await userEvent.type(colorPickerInput, '#000000');
  //
  //   expect(screen.getByText(/#000000/i)).toBeDefined();
  // });
});
