import DomainRegisteredDialog from './DomainRegisteredDialog';
import useDomainRegisteredDialog from './useDomainRegisteredDialog';

export function DomainRegisteredDialogProvider() {
  const { open, handleCloseDomainRegisteredDialog } =
    useDomainRegisteredDialog();

  if (!open) {
    return null;
  }

  return (
    <DomainRegisteredDialog
      open={open}
      handleClose={handleCloseDomainRegisteredDialog}
    />
  );
}

export default DomainRegisteredDialogProvider;
