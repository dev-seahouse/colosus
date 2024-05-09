import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';
import type { FormHTMLAttributes } from 'react';

const StyledForm = styled('form', {})`
  width: 100%;
`;

/**
 * styled html form element with autoComplete & autoCapitalize "off" by default
 */
export const Form = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement>
>(({ autoCapitalize = 'off', autoComplete = 'off', ...rest }, ref) => (
  <StyledForm
    autoCapitalize={autoCapitalize}
    autoComplete={autoComplete}
    {...rest}
    ref={ref}
  />
));

export default Form;
