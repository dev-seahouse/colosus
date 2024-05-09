import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  Typography,
  MuiLink,
} from '@bambu/react-ui';
import ConnectClientIllustration from './assets/ConnectClientsIllustration';
/* eslint-disable-next-line */
export interface ManageClientsProps {}
export function ManageClients(props: ManageClientsProps) {
  return (
    <Paper sx={{ display: 'flex', paddingY: 20, paddingX: 21 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <ConnectClientIllustration />
        <Stack
          sx={{ display: 'flex', marginLeft: 4, alignItems: 'flex-start' }}
        >
          <Stack sx={{ maxWidth: 375 }}>
            <Typography sx={{ fontSize: 22 }}>
              Manage your clients directly on our custodian’s platform
            </Typography>
            <Typography sx={{ fontSize: 16, marginTop: 3 }}>
              You should have received an email from Wealth Kernel prompting you
              to create an account on their platform.
            </Typography>
            <Box sx={{ display: 'flex', marginTop: 3 }}>
              <Typography sx={{ fontSize: 16 }}>
                If you didn’t receive it,
              </Typography>
              <Link
                sx={{ marginLeft: '5px' }}
                to={'mailto:tenants@wealthkernel.com'}
              >
                let us know.
              </Link>
            </Box>
          </Stack>
          <Stack sx={{ pt: 2 }}>
            <MuiLink
              type="button"
              href="https://myapplications.microsoft.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>View Clients</Button>
            </MuiLink>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
export default ManageClients;
