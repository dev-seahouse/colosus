import { Box, Paper, Typography, Stack, Link } from '@bambu/react-ui';
import RejectedIllustration from './assets/RejectedIllustration';

export function GetVerifiedKycStatusFailed() {
  // tenants@wealthkernel.com
  return (
    <Paper sx={{ padding: 20 }}>
      <Box sx={{ display: 'flex' }}>
        <Stack
          direction="row"
          spacing={4}
          sx={{ display: 'flex', alignItems: 'flex-start' }}
        >
          <RejectedIllustration />
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 22, fontWeight: '700' }}>
              Unfortunately, your KYC/AML verification has been rejected
            </Typography>
            <Typography>
              For details on the reason(s) your submission was rejected, you can
              contact Wealth Kernel at{' '}
              <Link to={`mailto:tenants@wealthkernel.com}`}>
                tenants@wealthkernel.com
              </Link>
            </Typography>
            <Typography>
              Please note that this will not affect your ability to create and
              share your own non-transactional robo-advisor utilising features
              available for Connect users.
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
export default GetVerifiedKycStatusFailed;
