import { Typography } from '@bambu/react-ui';

export function InstructionHeader() {
  return (
    <>
      <Typography
        as="h1"
        sx={{
          fontSize: '1.375rem',
          fontWeight: 700,
          lineHeight: '28px',
          margin: 0,
        }}
      >
        Start investing in just a few steps
      </Typography>
      <Typography>
        To fund your goal, just follow these simple steps.
      </Typography>
    </>
  );
}

export default InstructionHeader;
