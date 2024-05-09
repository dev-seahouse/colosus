import ShareIcon from '@mui/icons-material/Share';
import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@bambu/react-ui';
import { useSelectUnfinishedTaskIndexQuery } from '@bambu/go-advisor-core';
import { useState } from 'react';
import ShareRoboDialog from './ShareRoboDialog';

export function ShareRoboButton() {
  const hasCompletedAllTasks = useSelectUnfinishedTaskIndexQuery() === -1;
  const icon = hasCompletedAllTasks ? <ShareIcon /> : <LockIcon />;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        size="large"
        onClick={handleClickOpen}
        startIcon={icon}
        disabled={!hasCompletedAllTasks}
      >
        Share my robo
      </Button>
      <ShareRoboDialog open={open} handleClose={handleClose} />
    </>
  );
}

export default ShareRoboButton;
