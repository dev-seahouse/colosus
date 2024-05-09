import { useSelectPlatformNameQuery } from '@bambu/go-core';
import { Typography } from '@bambu/react-ui';

export function ConfidentialInformationDisclaimer() {
  const { data: platformName } = useSelectPlatformNameQuery();

  return (
    <Typography variant="caption">
      {`Your information will be kept secure and won’t be shared with anyone
          outside of ${platformName}`}
    </Typography>
  );
}

export default ConfidentialInformationDisclaimer;
