import { BackButton, Box, Button } from '@bambu/react-ui';
import GoalSettingsFormAction from '../../layouts/GoalSettingsFormAction/GoalSettingsFormAction';
import { useFormContext } from 'react-hook-form';
import type { SetupContributionFormState } from '../SetupContributionForm/SetupContributionForm';
import { BottomAction, useSelectUpdateGoalData } from '@bambu/go-core';
import { useNavigate } from 'react-router-dom';

function SetupContributionAction() {
  return (
    <>
      <MobileBottomAction />
      <DesktopBottomAction />
    </>
  );
}
/* show in < md */
function MobileBottomAction() {
  return (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      <BottomAction>
        <FormAction />
      </BottomAction>
    </Box>
  );
}
/* show in > md */
function DesktopBottomAction() {
  return (
    <Box display={{ xs: 'none', md: 'flex' }} justifyContent={'space-around'}>
      <FormAction />
    </Box>
  );
}

function FormAction() {
  const { handleSubmit } = useFormContext<SetupContributionFormState>();
  const updateGoalData = useSelectUpdateGoalData();
  const navigate = useNavigate();
  const handleNextClick = handleSubmit(
    ({ initialDeposit, recurringDeposit }) => {
      updateGoalData({
        initialInvestment: initialDeposit,
        monthlyContribution: recurringDeposit,
      });

      navigate('/goal-insight');
    }
  );

  return (
    <GoalSettingsFormAction>
      {/*!! previous page is investment style result ?  */}
      <BackButton
        fullWidth
        variant="outlined"
        startIcon={null}
        color="primary"
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        onClick={handleNextClick}
      >
        Next
      </Button>
    </GoalSettingsFormAction>
  );
}

export default SetupContributionAction;
