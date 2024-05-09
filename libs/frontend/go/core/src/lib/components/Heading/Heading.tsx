import { Typography, Stack } from '@bambu/react-ui';

export interface HeadingProps {
  title: string;
  /* subtitle should not be block-level elements e.g div, p because Typography renders as 'p' by default */
  subtitle?: string | React.ReactElement;
}

export function Heading({ title, subtitle }: HeadingProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="h1">{title}</Typography>
      {subtitle && <Typography>{subtitle}</Typography>}
    </Stack>
  );
}

export default Heading;
