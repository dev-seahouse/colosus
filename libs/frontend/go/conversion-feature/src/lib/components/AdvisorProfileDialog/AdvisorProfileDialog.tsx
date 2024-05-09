import {
  useSelectAdvisorBioQuery,
  useSelectAdvisorFullNameQuery,
  useSelectAdvisorProfilePicture,
  useSelectAdvisorReasonsToContactMeQuery,
} from '@bambu/go-core';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { HtmlContent } from '@bambu/go-goal-settings-feature';
import type { DialogProps } from '@bambu/react-ui';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  MuiLink,
  Stack,
  Box,
  IconButton,
  styled,
} from '@bambu/react-ui';

export interface AdvisorProfileDialogProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
}

const ProfileImg = styled('img')<{ isShown: boolean }>(
  {
    display: 'block',
    height: '81px',
    aspectRatio: '1 / 1',
    marginBottom: '1rem',
  },
  ({ isShown }) => ({
    display: isShown ? 'block' : 'none',
  })
);
export function AdvisorProfileDialog({
  onClose,
  open,
}: AdvisorProfileDialogProps) {
  const { data: fullName } = useSelectAdvisorFullNameQuery();
  const { data: profilePicture } = useSelectAdvisorProfilePicture();
  const { data: bioData } = useSelectAdvisorBioQuery();
  const { data: contactMeReason } = useSelectAdvisorReasonsToContactMeQuery();

  const profileTitle = fullName ? `${fullName}'s profile` : '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby="advisor-profile-dialog-title"
      aria-describedby="advisor-profile-dialog-content"
    >
      <Box display="flex" justifyContent="flex-end" px={1} pt={1} pb={0}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[800],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogTitle
        id="advisor-profile-dialog-title"
        fontWeight="700"
        sx={{ py: 0 }}
      >
        <ProfileImg
          loading="lazy"
          decoding="async"
          alt={fullName ? `${fullName}'s profile picture` : ''}
          src={profilePicture}
          isShown={!!profilePicture}
        />
        {profileTitle}
      </DialogTitle>

      <DialogContent id="advisor-profile-dialog-content">
        <Stack spacing={2}>
          <Box sx={{ wordWrap: 'break-word' }}>
            <HtmlContent content={bioData?.content ?? ''} />

            <MuiLink
              underline="always"
              href={bioData?.fullProfileLink}
              target="_blank"
              rel="noopener"
              sx={{ display: bioData?.fullProfileLink ? 'block' : 'block' }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}
                component="span"
              >
                <span>View profile</span>
                <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
              </Box>
            </MuiLink>
          </Box>

          <Box sx={{ wordWrap: 'break-word' }}>
            <HtmlContent content={contactMeReason ?? ''} />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdvisorProfileDialog;
