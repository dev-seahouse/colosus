import { Box, Card, CardContent, Stack, Typography } from '@bambu/react-ui';

export interface DashboardBannerLayoutProps {
  title: React.ReactNode;
  description: React.ReactNode;
  action?: React.ReactNode;
}

export function DashboardBannerLayout(props: DashboardBannerLayoutProps) {
  return (
    <Card sx={{ px: 1, pt: 1 }}>
      <CardContent sx={{ '&&': { pb: 1.6 } }}>
        <Stack spacing={1}>
          <Typography variant={'h5'} fontSize="22px" component={'h1'}>
            {props.title}
          </Typography>
          <Typography variant={'body2'} fontWeight={500}>
            {props.description}
          </Typography>
          <Box py={1}>{props.action}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DashboardBannerLayout;
