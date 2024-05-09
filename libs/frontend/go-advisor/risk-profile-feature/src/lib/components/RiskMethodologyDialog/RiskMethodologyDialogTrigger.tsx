import { MuiLink } from '@bambu/react-ui';
import { useState } from 'react';

import RiskMethodologyDialog from './RiskMethodologyDialog';

export const RiskMethodologyDialogTrigger = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <MuiLink component="button" onClick={() => setIsDialogOpen(true)}>
        click here
      </MuiLink>
      <RiskMethodologyDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default RiskMethodologyDialogTrigger;
