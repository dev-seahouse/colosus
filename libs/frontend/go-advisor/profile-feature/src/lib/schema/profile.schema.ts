import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z
    .string({ invalid_type_error: 'Your first name is required.' })
    .min(1, 'Your first name is required.'),
  lastName: z
    .string({ invalid_type_error: 'Your last name is required.' })
    .min(1, 'Your last name is required.'),
  jobTitle: z
    .string({ invalid_type_error: 'Your job title is required.' })
    .min(1, 'Your job title is required.'),
  businessName: z
    .string({ invalid_type_error: 'The name of your business is required.' })
    .min(1, 'The name of your business is required.'),
  countryOfResidence: z
    .string({
      required_error: 'Your country of residence is required.',
      invalid_type_error: 'Your country of residence is required.',
    })
    .min(1, 'Your country of residence is required.'),
  region: z
    .string({ invalid_type_error: 'Your state or region is required.' })
    .min(1, 'Your state or region is required.'),
});

export default profileSchema;
