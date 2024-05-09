import {
  Paper,
  Box,
  Divider,
  Typography,
  Button,
  Stack,
} from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import { useGetTopLevelOptions } from '@bambu/go-advisor-core';
import LeadsDetailsDialog from '../LeadsDetailsDialog/LeadsDetailsDialog';
import EditIcon from '@mui/icons-material/Edit';
import CurrencyField from './CurrencyField';

const paperStyles = {
  p: 1.9,
  '& svg': {
    m: 0.4,
  },
  '& hr': {
    mx: 3,
  },
};

export interface LeadsFilterHeaderProps {
  minimumIncome?: number;
  minimumCashSavings?: number;
}

function LeadsFilterHeader({
  minimumIncome,
  minimumCashSavings,
}: LeadsFilterHeaderProps) {
  const navigate = useNavigate();
  const { data: options } = useGetTopLevelOptions({
    initialData: {
      incomeThreshold: minimumIncome,
      retireeSavingsThreshold: minimumCashSavings,
    },
  });

  return (
    <Paper component="header" sx={paperStyles}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" fontWeight={700}>
          Qualified lead filtering
        </Typography>

        <LeadsDetailsDialog title="Qualified Lead filtering">
          <Stack spacing={2}>
            <Typography>
              Focus your time and energy on leads that meet your needs. Our
              automated leads filtering lets you classify leads by available
              capital, making it simple to focus on leads who are most valuable
              to you.
            </Typography>
            <Typography>
              Click “Edit settings” on the leads filter bar at anytime to adjust
              your criteria for qualified leads.
            </Typography>
            <Typography>
              <strong>Qualified lead:</strong> A prospective client who has
              indicated interest in your expertise and meets your criteria for
              minimum annual income or savings.
            </Typography>
            <Typography>
              <strong>Unqualified lead:</strong> A prospective client who has
              indicated interest in your expertise but does not meet your
              criteria for minimum annual income or savings.
            </Typography>
          </Stack>
        </LeadsDetailsDialog>

        <Divider orientation="vertical" flexItem />

        <Box
          sx={{
            display: 'flex',
            flexDirecion: 'row',
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <CurrencyField
              label="Minimum annual income:"
              value={options?.incomeThreshold || 0}
            />
          </Box>

          <Typography>OR</Typography>

          <Box>
            <CurrencyField
              label="Minimum cash savings:"
              value={options?.retireeSavingsThreshold || 0}
            />
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Button
          variant="text"
          size="small"
          type="button"
          onClick={() => navigate('setting')}
        >
          {/* startIcon prop adds extra margin don't fit design */}
          <EditIcon fontSize="small" />
          Edit settings
        </Button>
      </Box>
    </Paper>
  );
}

export default LeadsFilterHeader;
