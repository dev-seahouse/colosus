import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export function OpenInvestAccountButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/open-invest-account');
  };

  return (
    <Button onClick={handleClick}>
      <span>Open an investment account</span>
    </Button>
  );
}

export default OpenInvestAccountButton;
