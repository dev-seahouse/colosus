import { z } from 'zod';

export const createAccountFormSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password does not meet requirements')
      .regex(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
        ),
        'Password does not meet requirements'
      ),
    repeatPassword: z.string().min(1, 'Passwords do not match'),
    hasAgreed: z.literal(true as boolean, {
      errorMap: () => ({
        message: 'Please acknowledge the above agreement to use this service',
      }),
    }),
  })
  .partial()
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });

export default createAccountFormSchema;
