import { Typography, Button, Stack, Box } from '@bambu/react-ui';
import DOMPurify from 'dompurify';
import { useState } from 'react';

import { truncateRiskProfileDescriptionBeforeLineBreak } from './RiskProfilesTable.utils';

export interface RiskProfileTableDescriptionCellProps {
  description?: string;
}

export const RiskProfileTableDescriptionCell = ({
  description,
}: RiskProfileTableDescriptionCellProps) => {
  const [showMore, setShowMore] = useState(false);

  if (!description) {
    return <Typography>-</Typography>;
  }

  const toggleShowMore = () => setShowMore((prevShowMore) => !prevShowMore);

  return (
    <Stack spacing={1}>
      <Typography
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            showMore
              ? description
              : truncateRiskProfileDescriptionBeforeLineBreak(description)
          ),
        }}
      />
      <Box>
        <Button onClick={toggleShowMore} variant="text">
          {showMore ? 'Read less' : 'Read more'}
        </Button>
      </Box>
    </Stack>
  );
};

export default RiskProfileTableDescriptionCell;
