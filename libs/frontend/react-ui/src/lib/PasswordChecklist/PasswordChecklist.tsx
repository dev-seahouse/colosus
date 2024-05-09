import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RPC from 'react-password-checklist';
import { Stack, styled } from '@mui/material';
import Typography from '../Typography/Typography';

const StyledPasswordChecklist = styled(RPC)`
  font-size: 14px;
  font-weight: 400;
  margin-top: 6px !important;
  & > li {
    align-items: center;
    gap: 8px;
    & > span {
      padding-top: 0;
    }
  }
`;

export function PasswordChecklist({
  value,
  valueAgain,
}: {
  value?: string;
  valueAgain?: string;
}) {
  return (
    <Stack>
      <Typography variant="body2">Your password must include:</Typography>
      <StyledPasswordChecklist
        iconComponents={{
          ValidIcon: (
            <CheckCircleOutlineIcon color="primary" fontSize="small" />
          ),
          InvalidIcon: <ClearIcon color="error" fontSize="small" />,
        }}
        iconSize={14}
        rules={['minLength', 'specialChar', 'number', 'capital', 'lowercase']}
        minLength={10}
        value={value || ''}
        valueAgain={valueAgain}
        messages={{
          minLength: 'At least 10 characters',
          specialChar: 'At least 1 special character',
          number: 'At least 1 number',
          capital: 'At least 1 upper case letters',
          lowercase: 'At least 1 lower case letters',
        }}
      />
    </Stack>
  );
}

export default PasswordChecklist;
