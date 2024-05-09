import { BackButton, Box, Button, Container, Grid } from '@bambu/react-ui';
import InstructionSteps from '../../components/InstructionSteps/InstructionSteps';
import InstructionHeader from '../../components/InstructionHeader/InstructionHeader';
import { BottomAction, GoAppLayout } from '@bambu/go-core';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    label: 'Create account',
    description: `Creating an account allows you to save your progress and secure the informations.`,
  },
  {
    label: 'Open investment account',
    description: `The information used to open the account will remain strictly confidential. The approval may take 2-3 business days.`,
  },
  {
    label: 'Select your payment method',
    description: `Choose your preferred payment method to fund your goal.`,
  },
  {
    label: 'Fund your goal',
    description: `Transfer money to your account and you’ll be on your way achieving your goal.`,
  },
];
export function RoboInstructionPage() {
  const navigate = useNavigate();
  function handleNextClick() {
    navigate('../create-account');
  }
  return (
    <GoAppLayout>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BackButton />
          </Grid>
          <Grid
            item
            container
            xs={12}
            direction={'column'}
            alignItems={['flex-start', 'center']}
          >
            <InstructionHeader />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent={['flex-start', 'center']}>
              <Grid item>
                <InstructionSteps steps={steps} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box display={{ xs: 'block', md: 'none' }}>
              <BottomAction>
                <Button fullWidth type="button" onClick={handleNextClick}>
                  Next
                </Button>
              </BottomAction>
            </Box>
            <Box
              display={{
                xs: 'none',
                md: 'flex',
                justifyContent: ['flex-start', 'flex-end'],
              }}
            >
              <Button
                type="button"
                variant="contained"
                onClick={handleNextClick}
              >
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </GoAppLayout>
  );
}

export default RoboInstructionPage;
