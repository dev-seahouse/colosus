import type { TextFieldProps } from '@mui/material';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useState, forwardRef } from 'react';

export type PasswordFieldProps = Omit<TextFieldProps, 'type'>;

export const PasswordField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  PasswordFieldProps
>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <TextField
      inputRef={ref}
      {...props}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Toggle password visibility"
              edge="end"
              onClick={toggleShowPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
});

export default PasswordField;
