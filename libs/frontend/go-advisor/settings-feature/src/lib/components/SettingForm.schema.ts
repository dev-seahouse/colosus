import { z } from 'zod';

const UK_SORT_CODE_PATTERN = /^\d{2}-\d{2}-\d{2}$/;
const UK_BANK_ACC_NUM_PATTERN = /^[0-9]{8}$/;

export const settingsFormSchema = z
  .object({
    annualManagementFee: z
      .number()
      .max(100, 'Please enter a value less than 100'),
    sortCode: z
      .string({
        required_error: 'Sort code is required',
      })
      .trim()
      .regex(UK_SORT_CODE_PATTERN, 'Please enter a valid sort code'),
    accountName: z
      .string({
        required_error: 'Account name is required',
      })
      .trim()
      .regex(/^[a-zA-Z\s]+$/, 'Please enter a valid name on bank account'),
    accountNumber: z
      .string({
        required_error: 'Account number is required',
      })
      .trim()
      .regex(UK_BANK_ACC_NUM_PATTERN, 'Please enter a valid account number'),
  })
  .required();
