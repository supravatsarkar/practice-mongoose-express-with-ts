import { z } from "zod";

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be string",
      })
      .trim()
      .max(20)
      .min(6),
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim(),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string(),
    email: z.string().email(),
    contactNo: z
      .string({
        required_error: "Contact No is required",
        invalid_type_error: "Contact No must be a string",
      })
      .trim(),
    emergencyContactNo: z
      .string({
        required_error: "Contact No is required",
        invalid_type_error: "Contact No must be a string",
      })
      .trim(),
    presentAddress: z.string(),
    permanentAddress: z.string(),
    academicDepartment: z.string(),
  }),
});
const updateFacultyValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim()
      .optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    dateOfBirth: z.date().optional(),
    email: z.string().email().optional(),
    contactNo: z
      .string({
        required_error: "Contact No is required",
        invalid_type_error: "Contact No must be a string",
      })
      .trim()
      .optional(),
    emergencyContactNo: z
      .string({
        required_error: "Contact No is required",
        invalid_type_error: "Contact No must be a string",
      })
      .trim()
      .optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
    profileImage: z.string().optional().optional(),
    academicDepartment: z.string().optional(),
  }),
});

export const FacultyValidation = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
