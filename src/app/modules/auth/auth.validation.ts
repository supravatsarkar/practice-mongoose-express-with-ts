import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    password: z.string(),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refresh_token: z.string({
      required_error:
        "Refresh token is required. Please check the browser cookies",
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
