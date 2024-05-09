import { Grid, BackButton, Container, Box } from '@bambu/react-ui';
import InstructionSteps from '../../components/InstructionSteps/InstructionSteps';
import InstructionHeader from '../../components/InstructionHeader/InstructionHeader';
import { BottomAction, GoAppLayout } from '@bambu/go-core';
import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    label: 'Create account',
    description: `Creating an account allows you to save your progress and secure the informations.`,
  },
  {
    label: 'Schedule an appointment',
    description: `Schedule a no-obligation session with a trusted advisor for expert insights and enhance your investment strategy.`,
  },
];

export function AdvisorInstructionPage() {
  const navigate = useNavigate();
  function handleNextClick() {
    navigate('./');
  }
  return (
    <GoAppLayout>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BackButton />
          </Grid>
          <Grid item xs={12}>
            <InstructionHeader />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
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
              display={{ xs: 'none', md: 'flex', justifyContent: 'flex-end' }}
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

export default AdvisorInstructionPage;
