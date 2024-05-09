import { Box, Typography } from '@bambu/react-ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export function LeadsSettingHeader() {
  return (
    <>
      <Typography variant="subtitle1" fontWeight="bold">
        Set the minimum annual income and cash savings criteria your leads must
        meet to qualify for your services.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          pb: 2,
        }}
      >
        <InfoOutlinedIcon sx={{ color: '#444845' }} />
        <Typography color="#3F4945" variant="subtitle1">
          Your clients <strong>only need to meet one of these criteria</strong>{' '}
          to be captured as a qualified lead.
        </Typography>
      </Box>
    </>
  );
}

export default LeadsSettingHeader;
