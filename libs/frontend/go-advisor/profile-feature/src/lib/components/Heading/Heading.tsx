import { Stack, Typography } from '@bambu/react-ui';

export interface HeadingProps {
  title: string;
  subtitle?: string;
}

export function Heading({
  title = 'Title is rendered here',
  subtitle,
}: HeadingProps) {
  return (
    <Stack spacing={4}>
      <Typography
        variant="h1"
        sx={{ fontSize: '2.8125rem' }}
        textAlign="center"
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ fontSize: '1.5rem' }}>{subtitle}</Typography>
      )}
    </Stack>
  );
}

export default Heading;
