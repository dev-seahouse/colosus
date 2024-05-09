import { Box, Stack, Typography } from '@bambu/react-ui';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SuccessSnackBarProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function SuccessSnackBar({
  title = 'Thank you for submitting your information.',
  description = 'We have received your details and will review them shortly.',
}: SuccessSnackBarProps) {
  return (
    <Stack direction={'row'} alignItems={'center'} spacing={2}>
      <CheckCircleIcon color={'success'} />
      <Box>
        <Typography fontSize={'14px'} fontWeight={'bold'}>
          {title}
        </Typography>
        <Typography fontSize={'14px'}> {description}</Typography>
      </Box>
    </Stack>
  );
}
export default SuccessSnackBar;
