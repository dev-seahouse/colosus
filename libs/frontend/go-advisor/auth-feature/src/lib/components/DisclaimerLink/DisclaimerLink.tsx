import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  MuiLink,
  Typography,
} from '@bambu/react-ui';

export function DisclaimerLink({
  field,
  error,
  helperText,
}: {
  field: object;
  error: boolean;
  helperText?: string;
}) {
  return (
    <FormControl error={error}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox
          id="checkbox-disclaimer"
          sx={
            error
              ? {
                  color: '#ba1a1a',
                }
              : null
          }
          {...field}
        />
        <Typography variant="body2">
          I agree to Bambu GO’s&nbsp;
          <MuiLink
            id="link-terms-of-service"
            href="https://bambugo.com/terms-of-service/"
            target="_blank"
          >
            Terms of Service
          </MuiLink>{' '}
          and&nbsp;
          <MuiLink
            id="link-privacy-policy"
            href="https://bambugo.com/privacy-policy/"
            target="_blank"
          >
            Privacy Policy
          </MuiLink>
          .
        </Typography>
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default DisclaimerLink;
