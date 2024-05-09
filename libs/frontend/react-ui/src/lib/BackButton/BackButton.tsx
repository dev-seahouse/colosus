import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export interface BackButtonProps extends Omit<ButtonProps, 'type'> {
  label?: string;
}

export function BackButton({
  label = 'Back',
  color = 'inherit',
  variant = 'text',
  startIcon = <ArrowBackIcon />,
  ...rest
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      onClick={() => navigate(-1)}
      color={color}
      startIcon={startIcon}
      variant={variant}
      {...rest}
    >
      {label}
    </Button>
  );
}

export default BackButton;
