import { MuiLink, Stack, SxProps, Typography } from '@bambu/react-ui';

export function DataSheetLink({
  factSheetUrl,
  name,
  sx,
}: {
  factSheetUrl?: string | null;
  name?: string | null;
  sx?: SxProps;
}) {
  return factSheetUrl ? (
    <Stack mb={2} sx={sx}>
      <Typography>For more details download the</Typography>
      <MuiLink
        underline="always"
        href={factSheetUrl}
        target="_blank"
        rel="noopener"
      >
        {name} Factsheet
      </MuiLink>
    </Stack>
  ) : null;
}
