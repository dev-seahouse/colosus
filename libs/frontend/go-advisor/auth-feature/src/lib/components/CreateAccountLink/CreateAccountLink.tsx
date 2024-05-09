import { Typography, Link } from '@bambu/react-ui';

export function CreateAccountLink() {
  return (
    <Typography>
      Don't have an account? <Link to="create-account">Create one now</Link>
    </Typography>
  );
}

export default CreateAccountLink;
