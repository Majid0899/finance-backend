import { z } from 'zod';

const VALID_ROLES = ['viewer', 'analyst', 'admin'];

// ─── Auth Schemas ───────────────────────────────────────────────

export const validateRegister = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),

  role: z
    .enum(VALID_ROLES, {
      errorMap: () => ({ message: 'Role must be viewer, analyst, or admin' }),
    })
    .optional(),
});

export const validateLogin = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),

  password: z.string({ required_error: 'Password is required' }),
});

// ─── User Schemas ───────────────────────────────────────────────

export const validateUpdateUser = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    role: z
      .enum(VALID_ROLES, {
        errorMap: () => ({ message: 'Role must be viewer, analyst, or admin' }),
      })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.role !== undefined ||
      data.isActive !== undefined,
    {
      message: 'At least one field must be provided',
      path: [], // global error
    }
  );

export const validateChangePassword = z.object({
  currentPassword: z.string({
    required_error: 'Current password is required',
  }),

  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(6, 'New password must be at least 6 characters'),
});



const VALID_TYPES = ['income', 'expense'];

// ─── Financial Record Schema ─────────────────────────────────────────

export const validateCreateRecord = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),

  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be a positive number'),

  type: z.enum(VALID_TYPES, {
    errorMap: () => ({ message: 'Type must be income or expense' }),
  }),

  category: z.string(),

  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export const validateUpdateRecord = z
  .object({
    title: z.string().min(2, 'Title must be at least 2 characters').optional(),

    amount: z.coerce
      .number({
        invalid_type_error: 'Amount must be a number',
      })
      .positive('Amount must be a positive number')
      .optional(),

    type: z
      .enum(VALID_TYPES, {
        errorMap: () => ({ message: 'Type must be income or expense' }),
      })
      .optional(),

    category: z.string().optional(),

    notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'At least one field must be provided',
      path: [],
    }
  );