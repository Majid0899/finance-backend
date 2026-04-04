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