import { z } from 'zod';

export const scheduleAppointmentSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Your email address is required')
      .email('Please enter a valid email'),
    name: z.string().min(1, 'Your name is required'),
    phoneNumber: z.string().optional(),
    hasAgreed: z.literal(true, {
      errorMap: () => ({
        message: 'Please acknowledge the above agreement',
      }),
    }),
    sendGoalProjectionEmail: z.boolean(),
  })
  .required();
