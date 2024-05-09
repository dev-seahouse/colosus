import { Box, Typography, Avatar } from '@bambu/react-ui';

import {
  useSelectAdvisorFullNameQuery,
  useSelectAdvisorJobTitle,
  useSelectAdvisorProfilePicture,
} from '../../hooks/useGetAdvisorProfile/useGetAdvisorProfile.selectors';

export function AdvisorProfileDetails() {
  const { data: fullName } = useSelectAdvisorFullNameQuery();
  const { data: jobTitle = '-' } = useSelectAdvisorJobTitle();
  const { data: profilePicture } = useSelectAdvisorProfilePicture();

  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
      })}
    >
      {profilePicture && (
        <Box mr={2}>
          <Avatar
            variant="rounded"
            src={profilePicture}
            alt={`${fullName} profile picture`}
          />
        </Box>
      )}
      <Box>
        <Typography fontWeight={700}>{fullName}</Typography>
        <Typography variant="caption">{jobTitle}</Typography>
      </Box>
    </Box>
  );
}

export default AdvisorProfileDetails;
