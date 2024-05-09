import { Stack, Typography } from '@bambu/react-ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useParams } from 'react-router-dom';

export function PortfolioInfo() {
  const { portfolioType } = useParams();

  return (
    <Stack
      spacing={2}
      sx={{ background: '#F2F2F2', p: 1, borderRadius: '4px' }}
    >
      <Stack direction="row" spacing={1} justifyContent="center">
        <InfoOutlinedIcon />
        <Typography variant="body1">
          This portfolio is presented to investors who have a{' '}
          <b>{portfolioType} risk appetite</b>.
        </Typography>
      </Stack>
    </Stack>
  );
}

export default PortfolioInfo;
