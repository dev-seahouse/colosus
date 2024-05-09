import {
  Typography,
  Stack,
  TextField,
  Button,
  Form,
  useMobileView,
  Box,
} from '@bambu/react-ui';
import {
  BottomAction,
  useSelectZipCode,
  useSelectSetUserData,
} from '@bambu/go-core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const LOCATION_FORM_CTA = 'Next';

const locationFormSchema = z
  .object({
    zipCode: z
      .string()
      .regex(
        new RegExp(
          /^\d{5}(?:[-\s]\d{4})?|[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d|(?:\d{5}|\d{3})|(?:\d{4}|\d{6})|[A-Z\d]{3}\s?\d{2}|[A-Z\d]{4}\s?\d{2}|[A-Z\d]{5}\s?\d{2}|[A-Z\d]{6}\s?\d{2}|[A-Z\d]{7}\s?\d{2}|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}|[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}|[A-Z]{1,2}\d\s?\d[A-Z]{2}$/
        ),
        'Please provide a valid postal code'
      )
      .min(1, 'Please enter a valid postal code'),
  })
  .required();

export type LocationFormState = z.infer<typeof locationFormSchema>;

export function LocationForm() {
  const isMobileView = useMobileView();
  const navigate = useNavigate();
  const zipCode = useSelectZipCode();
  const setUserData = useSelectSetUserData();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LocationFormState>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      zipCode,
    },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit((data) => {
    setUserData(data);
    navigate('../age');
  });

  return (
    <Form id="location-form" data-testid="location-form" onSubmit={onSubmit}>
      <Stack spacing={10}>
        <Stack spacing={3}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            Where are you located?
          </Typography>
          <TextField
            label="Postal code"
            placeholder="Enter postal code"
            {...register('zipCode')}
            error={!!errors.zipCode}
            helperText={errors.zipCode?.message}
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <Button type="submit">{LOCATION_FORM_CTA}</Button>
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <Button type="submit" fullWidth>
            {LOCATION_FORM_CTA}
          </Button>
        </BottomAction>
      )}
    </Form>
  );
}

export default LocationForm;
