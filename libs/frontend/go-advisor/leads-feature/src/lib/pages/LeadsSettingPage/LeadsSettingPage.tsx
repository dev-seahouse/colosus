import { Button, Stack, Box } from '@bambu/react-ui';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Heading } from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';
import LeadsSettingFormDataLoader from '../../components/LeadsSettingForm/LeadsSettingFormDataLoader';

export function LeadsSettingPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3}>
      <Box>
        <Button
          type="button"
          variant="text"
          startIcon={<ArrowBackIcon />}
          color="inherit"
          onClick={() => navigate('/dashboard/leads')}
        >
          View Leads
        </Button>
      </Box>

      <Stack spacing={4}>
        <Box>
          <Heading title="Edit lead filter settings" />
        </Box>

        <LeadsSettingFormDataLoader />
      </Stack>
    </Stack>
  );
}

export default LeadsSettingPage;
