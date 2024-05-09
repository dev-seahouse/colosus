import GoalSettingsFormAction from '../../layouts/GoalSettingsFormAction/GoalSettingsFormAction';
import { BackButton, Button } from '@bambu/react-ui';

export function DownPaymentAction() {
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

export default DownPaymentAction;
