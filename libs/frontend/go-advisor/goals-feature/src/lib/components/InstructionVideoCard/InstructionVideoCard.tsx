import { Box, Card, Stack, Typography } from '@bambu/react-ui';
import { VideoPlayer } from '@bambu/go-advisor-core';

export interface InstructionVideoCardProps {
  title: string;
  content: string;
}

export function InstructionVideoCard({
  title,
  content,
}: InstructionVideoCardProps) {
  return (
    <Card>
      <Box p={4}>
        <Box display="flex" alignItems="center" sx={{ gap: 4 }}>
          <Stack spacing={1}>
            <Typography variant="h1">{title}</Typography>
            <Typography>{content}</Typography>
          </Stack>
          <Box>
            <VideoPlayer type="Goals" />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default InstructionVideoCard;
