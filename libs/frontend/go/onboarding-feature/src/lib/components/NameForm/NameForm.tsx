import { Stack, Box, Button, Typography, TextField } from '@bambu/react-ui';
import {
  useSelectName,
  useSelectSetUserData,
  BottomAction,
} from '@bambu/go-core';
import { Form, useMobileView } from '@bambu/react-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

const NAME_FORM_CTA = 'Next';

const nameFormSchema = z
  .object({
    // only allow letters for name
    name: z
      .string()
      .trim()
      .min(1, 'Your name is required')
      .regex(
        new RegExp(/^[A-Za-z]+( [A-Za-z]+)*$/),
        'Name should contain only alphabets'
      ),
  })
  .required();

type NameFormState = z.infer<typeof nameFormSchema>;

export function NameForm() {
  const isMobileView = useMobileView();
  const navigate = useNavigate();
  const setUserData = useSelectSetUserData();
  const name = useSelectName();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<NameFormState>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name,
    },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit((data) => {
    setUserData(data);
    navigate('../age');
  });

  return (
    <Form id="name-form" data-testid="name-form" onSubmit={onSubmit}>
      <Stack spacing={10}>
        <Stack spacing={3}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            What is your name?
          </Typography>
          <TextField
            label="Name"
            placeholder="Enter name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <Button type="submit">{NAME_FORM_CTA}</Button>
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <Button type="submit" fullWidth>
            {NAME_FORM_CTA}
          </Button>
        </BottomAction>
      )}
    </Form>
  );
}

export default NameForm;
