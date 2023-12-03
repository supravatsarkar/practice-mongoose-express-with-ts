import z from "zod";

const userNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine(v => v === v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), {
      message: "First Name must be capitalized+",
    }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1)
    .max(20)
    .refine(v => /^[A-Za-z]+$/.test(v), {
      message: "Last Name must be alphabet value",
    }),
});

// Define validation schema for Guardian
const guardianSchema = z.object({
  fatherName: z.string().min(1),
  fatherOccupation: z.string().min(1),
  fatherContactNo: z.string().min(1),
  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherContactNo: z.string().min(1),
});

// Define validation schema for LocalGuardian
const localGuardianSchema = z.object({
  name: z.string().min(1),
  occupation: z.string().min(1),
  contactNo: z.string().min(1),
  address: z.string().min(1),
});
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: "Password must be a string",
      })
      .max(20, { message: "Password can not be grater than 20 characters" })
      .optional(),
    student: z.object({
      name: userNameSchema,
      gender: z.enum(["male", "female", "other"]).refine(v => v !== undefined, {
        message: "Gender is required",
      }),
      dateOfBirth: z.string().min(1),
      email: z.string().email(),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z
        .enum(["A", "B", "AB", "O", "-A", "-B", "-AB", "-O"])
        .nullable(),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: guardianSchema,
      localGuardian: localGuardianSchema,
      profileImg: z.string().nullable(),
    }),
  }),
});

export const StudentValidation = { createStudentValidationSchema };
