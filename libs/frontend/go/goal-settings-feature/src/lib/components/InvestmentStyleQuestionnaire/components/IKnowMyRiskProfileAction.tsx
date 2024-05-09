import { Box, Button } from '@bambu/react-ui';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import { useNavigate } from 'react-router-dom';
import { useSelectSetHasSelectedRiskQuestionnaire } from '@bambu/go-core';

export function IKnowMyRiskProfileAction() {
  const navigate = useNavigate();
  const setRiskQuestionnaireSelection =
    useSelectSetHasSelectedRiskQuestionnaire();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        pb: 3,
      }}
    >
      <Button
        sx={{ bg: 'transparent' }}
        startIcon={<ScienceOutlinedIcon />}
        variant="text"
        onClick={() => {
          setRiskQuestionnaireSelection(false);
          navigate('../investment-style');
        }}
      >
        I know my risk profile
      </Button>
    </Box>
  );
}

export default IKnowMyRiskProfileAction;
