import { Grid } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';
import ConfigureGoalsForm from '../../components/ConfigureGoalsForm/ConfigureGoalsForm';
import InstructionVideoCard from '../../components/InstructionVideoCard/InstructionVideoCard';

export function ConfigureGoalsPage() {
  return (
    <Grid spacing={4} container>
      <Grid item xs={12}>
        <Heading
          title="Goals"
          subtitle="Configure your robo-advisor goals. You may hide or rearrange the goals as you see fit."
        />
      </Grid>

      <Grid item xs={12}>
        <ConfigureGoalsForm />
      </Grid>

      <Grid item xs={12}>
        <InstructionVideoCard
          title="Gain a better understanding of your client’s goals"
          content="Watch this video to see how our goal helpers automatically
                capture the most crucial aspects of your clients’ financial
                goals."
        />
      </Grid>
    </Grid>
  );
}

export default ConfigureGoalsPage;
