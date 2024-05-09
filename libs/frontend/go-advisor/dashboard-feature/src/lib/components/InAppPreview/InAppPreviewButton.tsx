import { Button } from '@bambu/react-ui';
import type { ButtonProps } from '@bambu/react-ui';

export interface InAppPreviewButtonProps extends Omit<ButtonProps, 'variant'> {
  active?: boolean;
}

export const InAppPreviewButton = ({
  active = false,
  ...rest
}: InAppPreviewButtonProps) => {
  const variant = active ? 'contained' : 'text';

  return <Button variant={variant} {...rest} />;
};

export default InAppPreviewButton;
