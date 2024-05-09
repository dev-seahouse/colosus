import { z } from 'zod';

export const platformSetupFormSchema = z.object({
  tradeName: z
    .string()
    .min(1, 'The name of your brand is required')
    .max(20, 'Your robo-advisor name exceeds 20 characters'),
  subdomain: z
    .string()
    .min(1, 'Your robo-advisor link is required')
    .regex(
      new RegExp('^[a-z-0-9]*$'),
      'Your link must include only lowercase letters, numbers and dashes (-)'
    )
    // to make sure it doesn't begin or end with a hyphen (-), type 'custom'
    .refine(
      (val) => val.match(/^(?!-)[^-].*(?<!-)$/),
      'Your link must not start or end with a dash (-)'
    )
    // to make sure it has at least 1 letter, type 'custom'
    .refine(
      (val) => val.match(/.*[a-z].*/),
      'Your link must include at least one letter'
    ),
});
