import { useState } from 'react';
import { Grid, Button, BackButton, Typography } from '@bambu/react-ui';
import { BottomAction, useSelectName } from '@bambu/go-core';
import InvestmentOptions from '../../components/InvestmentOptions/InvestmentOptions';
import { options } from '../../components/InvestmentOptions/InvestmentOptions';

export function ManageInvestmentOptionsPage() {
  const [value, setValue] = useState(options[0].value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const investorName = useSelectName() ?? '-';

  return (
    <Grid spacing={2} container sx={{ padding: '20px' }}>
      <Grid item xs={12}>
        <BackButton color="secondary" />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h1">
          Great job, {investorName}! How do you want to invest?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <InvestmentOptions handleChange={handleChange} value={value} />
      </Grid>
      <Grid item xs={12}>
        <BottomAction>
          <Button fullWidth>Next</Button>
        </BottomAction>
      </Grid>
    </Grid>
  );
}

export default ManageInvestmentOptionsPage;
