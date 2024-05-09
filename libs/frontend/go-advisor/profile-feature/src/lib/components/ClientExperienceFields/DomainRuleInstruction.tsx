import { Typography, Box, Stack } from '@bambu/react-ui';

import DomainRule from './DomainRule';
export const DomainRuleInstruction = () => {
  return (
    <Stack spacing={1} data-testid="domain-instruction">
      <Typography variant="body2">Your robo-advisor link must:</Typography>
      <Box>
        <DomainRule>
          Include only lowercase letters, numbers and dashes (-)
        </DomainRule>
        <DomainRule>Include at least one letter</DomainRule>
        <DomainRule>Not start or end with a dash (-)</DomainRule>
      </Box>
    </Stack>
  );
};

export default DomainRuleInstruction;
