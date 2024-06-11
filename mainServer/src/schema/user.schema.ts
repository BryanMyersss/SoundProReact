import { z } from 'zod';

// Calculate the date 18 years ago from now
const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export const createUserSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: 'Username is required'
    }).min(4, 'Username cannot be shorter than 4 characters'),
    password: z.string({
      required_error: 'Password is required'
    }).min(6, "Password cannot be shorter than 6 characters"),
    passwordConfirmation: z.string({
      required_error: 'Password confirmation is required'
    }),
    email: z.string({
      required_error: 'Email is required'
    }).email('Invalid email'),
    birth: z.coerce.date({
      required_error: 'Birth is required'
    }).max(eighteenYearsAgo, 'You must be at least 18 years old'),
    business: z.string().optional(),
    dni: z.string({
      required_error: 'DNI is required'
    }),
    phone: z.string({
      required_error: 'Phone is required'
    })
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  })
});

export type CreateUserInput = z.infer<typeof createUserSchema>;