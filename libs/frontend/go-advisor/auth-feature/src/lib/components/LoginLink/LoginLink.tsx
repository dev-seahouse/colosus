import { Typography, Link } from '@bambu/react-ui';

interface LoginLinkProps {
  label?: string;
  linkText?: string;
}

export function LoginLink({
  label = 'Already have an account?',
  linkText = 'Log in',
}: LoginLinkProps) {
  return (
    <Typography variant="body2">
      <span id="login-link-label">{label} </span>
      <Link to="/" data-testid="login-link" aria-describedby="login-link-label">
        {linkText}
      </Link>
    </Typography>
  );
}

export default LoginLink;
