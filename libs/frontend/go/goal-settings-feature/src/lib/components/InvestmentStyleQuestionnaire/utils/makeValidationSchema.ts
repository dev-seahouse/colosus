import { z } from 'zod';

export function makeValidationSchema({ name }: { name: string }) {
  return z
    .object({
      [name]: z
        .string({
          required_error: 'Please answer the question to proceed',
        })
        .min(1, 'Please answer the question to proceed'),
    })
    .required();
}
