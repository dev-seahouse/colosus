import { Typography, Grid } from '@bambu/react-ui';
import type { SectionComponentProps } from './componentFactory';
function Section({ title, children }: SectionComponentProps) {
  return (
    <Grid container item xs={12} spacing={1} wrap="nowrap" direction="column">
      <Grid item xs={12}>
        <Typography color="#444845" fontWeight="bold">
          {title}
        </Typography>
      </Grid>
      {children}
    </Grid>
  );
}

export default Section;
