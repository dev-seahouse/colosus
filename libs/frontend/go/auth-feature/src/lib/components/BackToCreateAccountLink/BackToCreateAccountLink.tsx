import { Typography, Link } from '@bambu/react-ui';

export function BackToCreateAccountLink() {
  return (
    <Typography variant="body1">
      Not your email? <Link to="/create-account">Change email address</Link>
    </Typography>
  );
}

export default BackToCreateAccountLink;
