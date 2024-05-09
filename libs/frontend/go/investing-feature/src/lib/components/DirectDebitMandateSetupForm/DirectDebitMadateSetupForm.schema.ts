import { z } from 'zod';

const UK_BANK_ACC_NUM_PATTERN = /^[0-9]{8}$/;
const UK_SORT_CODE_PATTERN = /^\d{2}-\d{2}-\d{2}$/;

export const directDebitMandateSetupFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .regex(/^[a-zA-Z\s]+$/, 'Please enter a valid name on bank account'),
    accountNumber: z
      .string()
      .trim()
      .min(1, 'Account number is required')
      .regex(UK_BANK_ACC_NUM_PATTERN, 'Please enter a valid account number'),
    sortCode: z
      .string()
      .trim()
      .min(1, 'Sort code is required')
      .regex(UK_SORT_CODE_PATTERN, 'Please enter a valid sort code'),
    isAccountOwner: z
      .boolean({
        required_error:
          'Please acknowledge the above statement to use this service',
      })
      .refine((value) => value === true, {
        message: 'Please acknowledge the above statement to use this service',
      }),
    hasMultipleOwner: z.boolean().refine((v) => v === false, {
      message: 'Accounts with multiple signatories are not currently supported',
    }),
  })
  .required();

export default directDebitMandateSetupFormSchema;
