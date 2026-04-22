import { z } from "zod";

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  location: z.string().trim().max(120, "Location is too long").optional(),
  phone: z.string().trim().max(30, "Phone number is too long").optional(),
  dob: z.string().trim().optional(),
  sex: z.string().trim().optional(),
  bio: z.string().trim().max(300, "Bio is too long").optional(),
});

const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).+$/,
    "Password must include a letter, a number, and a special character"
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordRule,
    confirmNewPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "New passwords do not match",
  });

export type ProfileUpdateSchemaType = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;