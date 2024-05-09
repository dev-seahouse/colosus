import { Typography } from '@bambu/react-ui';

export function RiskProfileName(props: { investmentStyle: any }) {
  return (
    <>
      <Typography
        fontSize={{ xs: '1.75rem' }}
        variant={'h1'}
        fontWeight={400}
        lineHeight={1.4}
        textAlign={'center'}
        display={{ xs: 'block', sm: 'inline' }}
      >
        Your investment style is{' '}
      </Typography>
      <Typography
        fontSize={{ xs: '1.75rem' }}
        variant={'h1'}
        gutterBottom={false}
        fontWeight={400}
        display="inline"
        textAlign={'center'}
      >
        {props.investmentStyle}
      </Typography>
    </>
  );
}
