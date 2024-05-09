import { Typography, Grid, styled } from '@bambu/react-ui';
import type { ItemComponentProps } from './componentFactory';

const FieldTitle = styled('span')({
  color: '#8E918F',
});

export function Item({ title, children }: ItemComponentProps) {
  return (
    <Grid item container xs={6} justifyContent="space-between">
      <Grid item xs={6}>
        <Typography>
          <FieldTitle>{title}</FieldTitle>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        {children}
      </Grid>
    </Grid>
  );
}

export default Item;
