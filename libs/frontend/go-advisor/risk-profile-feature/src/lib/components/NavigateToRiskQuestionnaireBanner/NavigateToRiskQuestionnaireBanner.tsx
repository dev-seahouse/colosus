import { Card, Box, Typography, Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export function NavigateToRiskQuestionnaireBanner() {
  const navigate = useNavigate();

  const handleClick = () => navigate('../risk-profile/questionnaire');

  return (
    <Card>
      <Box p={4} display="flex" alignItems="center" sx={{ gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={700}>
            Have you configured your risk questionnaire?
          </Typography>
        </Box>
        <Box>
          <Button onClick={handleClick} variant="outlined">
            Go to Risk Questionnaire
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

export default NavigateToRiskQuestionnaireBanner;
