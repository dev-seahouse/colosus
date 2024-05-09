import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';
import {
  FormControlLabel,
  Checkbox,
  Box,
  MuiLink,
  FormControl,
  FormHelperText,
} from '@bambu/react-ui';
import useGetDocuments from '../../hooks/useGetDocuments/useGetDocuments';
import { useSelectPlatformNameQuery } from '../../hooks/useGetBranding/useGetBranding.selectors';

type PlatformTermsConditionCheckboxProps<T extends FieldValues> =
  UseControllerProps<T>;

export function PlatformTermsConditionCheckbox<T extends FieldValues>(
  props: PlatformTermsConditionCheckboxProps<T>
) {
  const { data: documents } = useGetDocuments();
  const { data: platformName } = useSelectPlatformNameQuery();

  const {
    field,
    fieldState: { error },
  } = useController(props);

  const { ref, ...rest } = field;

  return (
    <FormControl error={!!error}>
      <FormControlLabel
        inputRef={ref}
        {...rest}
        label={
          <Box ml={1.3} lineHeight={'20px'}>
            I agree to {`${platformName}'s `}
            <MuiLink href={documents?.privacyPolicyUrl ?? '/'} target="_blank">
              Terms of Service
            </MuiLink>
            {' and '}
            <MuiLink
              href={documents?.termsAndConditionsUrl ?? '/'}
              target="_blank"
            >
              Privacy Policy
            </MuiLink>
          </Box>
        }
        control={<Checkbox />}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}

export default PlatformTermsConditionCheckbox;
