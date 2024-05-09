import { DateTime } from 'luxon';
import { z } from 'zod';

import { isValidNINO } from './OpenInvestAccountForm.utils';

const accountDetailsSchema = z.object({
  isUSCitizen: z
    .boolean()
    .nullable()
    .refine((value) => value != null, {
      message: 'Please select an option',
    }),
  isUKTaxResident: z
    .boolean()
    .nullable()
    .refine((value) => value != null, {
      message: 'Please select an option',
    }),

  accountType: z.string().trim().min(1, 'Account type is required'),
});

const personDetailsSchema = z.object({
  // person details
  title: z.string().trim().min(1, 'Title is required'), // Mr, Mrs, Miss, Ms, Dr, Prof
  forename: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .regex(
      new RegExp(/^[A-Za-z]+$/),
      'First name should contain only alphabets'
    ), // first name
  middleName: z
    .string()
    .trim()
    .optional()
    .refine((value) => {
      if (value == null || value === '') return true;
      return /^[A-Za-z]+$/.test(value);
    }, 'Middle name should contain only alphabets'),

  surname: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .regex(
      new RegExp(/^[A-Za-z]+$/),
      'Last name should contain only alphabets'
    ),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, 'Date of birth is required')
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      'Please enter a valid Date of birth (DD/MM/YYYY)'
    )
    .refine((value) => {
      const currentDate = DateTime.now();
      const birthDate = DateTime.fromFormat(value, 'dd/MM/yyyy');
      const ageInYears = currentDate.diff(birthDate, 'years').years;
      return ageInYears >= 18 && ageInYears <= 122;
    }, 'Minimum age is 18'),
  nationalitiesOption: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .refine((obj) => obj.label.length > 1, {
      message: 'Nationality is required',
    }),
  nino: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, 'NINO is required')
    .refine((nino) => isValidNINO(nino), {
      message: 'Please enter a valid Nino',
    }),
});

const homeAddressSchema = z.object({
  line1: z
    .string()
    .trim()
    .min(1, 'Address line 1 is required')
    .max(100, "Address line 1 can't be more than 100 characters"),
  line2: z
    .string()
    .trim()
    // .min(1, 'Address line 2 is required')
    .max(100, 'Address line 2 cant be more than 100 characters')
    .optional(),
  line3: z
    .string()
    .trim()
    // .min(1, 'Address line 3 is required')
    .max(100, "Address line 3 can't be more than 100 characters")
    .optional(),
  city: z
    .string()
    .trim()
    .min(1, 'City is required')
    .max(100, "City can't be more than 100 characters")
    .regex(new RegExp(/^[A-Za-z]+$/), 'Please enter a valid city name'),
  postalCode: z
    .string()
    .toUpperCase()
    .trim()
    .min(1, 'Postal code is required')
    .regex(
      /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$/,
      'Please enter a valid postal code'
    ),
  countryCodeOption: z
    .object(
      {
        label: z.string().min(1),
        value: z.string().min(1),
      },
      {
        required_error: 'Country is required',
        invalid_type_error: 'Country is required',
      }
    )
    .required(),
});

const contactDetailsSchema = z.object({
  emailAddress: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  telephoneNumber: z
    .string()
    .trim()
    .min(1, 'Telephone number is required')
    .regex(/^(\+?)([0-9 ]{14})$/, 'Please enter a valid telephone number'),
});

const employmentDetailsSchema = z
  .object({
    employmentStatus: z.string().trim().min(1, 'Employment status is required'),
    sourceOfWealth: z.array(z.string()).min(1, 'Source of wealth is required'),
    industry: z.string().trim(),
    annualIncome: z
      .number({ required_error: 'Annual income is required' })
      .nullable()
      .refine((value) => value != null, {
        message: 'Annual income is required',
      }),
  })
  .required()
  .superRefine((value, ctx) => {
    if (
      value.employmentStatus === 'Retired' ||
      value.employmentStatus === 'Unemployed'
    ) {
      return true;
    }
    if (!value.industry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Employment details are required',
        path: ['industry'],
      });
    }
  });

export const openAccountFormSchema = z
  .object({
    accountInfo: accountDetailsSchema.required(),
    personalDetails: personDetailsSchema.required(),
    homeAddress: homeAddressSchema.required(),
    contactDetails: contactDetailsSchema.required(),
    employmentDetails: employmentDetailsSchema,
  })
  .required();

export default openAccountFormSchema;
