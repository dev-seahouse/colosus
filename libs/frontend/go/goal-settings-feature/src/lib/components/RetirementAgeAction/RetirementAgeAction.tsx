import { BackButton, Button } from '@bambu/react-ui';
import GoalSettingsFormAction from '../../layouts/GoalSettingsFormAction/GoalSettingsFormAction';

export function RetirementAgeAction() {
  return (
    <GoalSettingsFormAction>
      <BackButton
        fullWidth
        variant="outlined"
        startIcon={null}
        color="primary"
      />
      <Button fullWidth type="submit" variant="contained">
        Next
      </Button>
    </GoalSettingsFormAction>
  );
}

export default RetirementAgeAction;
