// src/schemaValidations/user.schema.ts
import { z } from "zod";

export const CreateUserBody = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    name: z.string().min(1, "Name is required"),
    phone: z.string().optional(),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdateUserBody = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export const UpdatePasswordBody = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type CreateUserBodyType = z.infer<typeof CreateUserBody>;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBody>;
export type UpdatePasswordBodyType = z.infer<typeof UpdatePasswordBody>;

export type UserType = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type UserResType = {
  status: number;
  message: string;
  payload: {
    data: UserType;
  };
};

export type UserListResType = {
  status: number;
  message: string;
  payload: {
    data: {
      meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
      };
      result: UserType[];
    };
  };
};
