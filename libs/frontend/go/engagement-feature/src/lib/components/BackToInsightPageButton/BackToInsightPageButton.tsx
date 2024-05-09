/* eslint-disable-next-line */
import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export function BackToInsightPageButton() {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(-2)} variant="text">
      Back to my financial plan
    </Button>
  );
}

export default BackToInsightPageButton;
