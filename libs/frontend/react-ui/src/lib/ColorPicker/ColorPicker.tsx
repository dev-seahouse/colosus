import { HexColorPicker, HexColorInput } from 'react-colorful';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';

import { useState, useEffect, useCallback } from 'react';
import type { MouseEvent, ComponentProps, HTMLAttributes } from 'react';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';

const StyledButton = styled(ButtonBase)(({ theme }) => ({
  padding: '0.25rem 0.75rem',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 2,
  fontSize: '1rem',
  fontFamily: theme.typography.fontFamily,
  fontWeight: 500,
  textTransform: 'uppercase',
  minWidth: 155,
  justifyContent: 'flex-start',
}));

interface ColorBoxProps {
  color?: string;
}

const ColorBox = styled('div')<ColorBoxProps>(({ color = '#fff', theme }) => ({
  backgroundColor: color,
  width: 34,
  height: 34,
  marginRight: '0.5rem',
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledHexColorInput = styled(HexColorInput)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.fontSize,
  padding: '0.5rem',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 2,
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
  },
}));

type InferredHexColorPickerProps = ComponentProps<typeof HexColorPicker>;

export interface ColorPickerProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  value?: InferredHexColorPickerProps['color'];
  onChange?: InferredHexColorPickerProps['onChange'];
}

export function ColorPicker({
  value = '#ff0000',
  onChange,
  ...rest
}: ColorPickerProps) {
  const [color, setColor] = useState(value);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'color-picker-popover' : undefined;
  const handleColorChange = useCallback(
    () => onChange?.(color),
    [color, onChange]
  );

  useEffect(() => {
    if (handleColorChange) {
      handleColorChange();
    }
  }, [handleColorChange]);

  return (
    <div>
      <StyledButton onClick={handleClick} {...rest}>
        <ColorBox color={color} />
        {color}
      </StyledButton>
      <Popover
        data-testid={id}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack sx={{ p: 2 }} spacing={2}>
          <HexColorPicker color={color} onChange={setColor} />
          <StyledHexColorInput
            aria-label="color-picker-input"
            color={color}
            onChange={setColor}
          />
        </Stack>
      </Popover>
    </div>
  );
}

export default ColorPicker;
