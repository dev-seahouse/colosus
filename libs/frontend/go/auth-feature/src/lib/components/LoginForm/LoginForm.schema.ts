import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password does not meet requirements')
    .regex(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
      ),
      'Password does not meet requirements'
    ),
});
