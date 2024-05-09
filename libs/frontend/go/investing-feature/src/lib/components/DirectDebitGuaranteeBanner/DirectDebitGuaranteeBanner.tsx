import {
  Stack,
  Typography,
  styled,
  MuiLink,
  Box,
  lighten,
} from '@bambu/react-ui';
import DirectDebitGuaranteeLogo from '../../../assets/direct_debit_gurantee_logo.svg';
import DirectDebitGuaranteeDialog from '../DirectDebitGuaranteeDialog/DirectDebitGuaranteeDialog';
import React from 'react';

const StyledDirectDebitGuaranteeLogo = styled('img')({
  aspectRadio: '1/3',
  width: '71px',
});

export function DirectDebitGuaranteeBanner() {
  const [open, toggleOpen] = React.useReducer((state) => !state, false);
  return (
    <Box
      component={'footer'}
      sx={(theme) => ({
        px: 3,
        py: 2,
        backgroundColor: lighten(theme.palette.primary.main, 0.9),
      })}
    >
      <Stack spacing={1} justifyContent={'space-between'} direction={'row'}>
        <Box textAlign={'left'} fontSize={'12px'} lineHeight={1.5}>
          <Typography color={'#8c8c8c'} fontSize={'11px'}>
            Direct Debit guarantee
          </Typography>
          <Typography fontSize={'inherit'}>
            Your payments are projected by the
          </Typography>
          <MuiLink component="button" onClick={toggleOpen}>
            Direct Debit guarantee.
          </MuiLink>
          <Typography fontSize={'inherit'}>
            Payments by GoCardless. Read the
          </Typography>
          <MuiLink href="https://gocardless.com/privacy" target="_blank">
            GoCardless privacy notice.
          </MuiLink>
        </Box>
        <StyledDirectDebitGuaranteeLogo
          src={DirectDebitGuaranteeLogo}
          alt="Direct Debit guarantee"
          loading={'lazy'}
        />
      </Stack>
      <DirectDebitGuaranteeDialog onClose={toggleOpen} open={open} />
    </Box>
  );
}

export default DirectDebitGuaranteeBanner;
