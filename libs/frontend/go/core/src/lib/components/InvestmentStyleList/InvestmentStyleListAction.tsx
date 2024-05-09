import { Button, Box, BackButton } from '@bambu/react-ui';
import type { ButtonProps } from '@bambu/react-ui';

export type InvestmentStyleListActionProps = ButtonProps;

export const InvestmentStyleListAction = (
  props: InvestmentStyleListActionProps
) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      pb: '1.75rem',
    }}
  >
    <BackButton
      {...props}
      variant="outlined"
      startIcon={null}
      color="primary"
    />
    <Button {...props} type="submit" variant="contained">
      Next
    </Button>
  </Box>
);

export default InvestmentStyleListAction;
