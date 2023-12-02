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
const studentValidationSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(4).max(20),
  name: userNameSchema,
  gender: z.enum(["male", "female", "other"]).refine(v => v !== undefined, {
    message: "Gender is required",
  }),
  dateOfBirth: z.string().min(1),
  email: z.string().email(),
  contactNo: z.string().min(1),
  emergencyContactNo: z.string().min(1),
  bloodGroup: z.enum(["A", "B", "AB", "O", "-A", "-B", "-AB", "-O"]).nullable(),
  presentAddress: z.string().min(1),
  permanentAddress: z.string().min(1),
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImg: z.string().nullable(),
  isActive: z.enum(["active", "block"]).default("active"),
  isDeleted: z.boolean().default(false),
});

export const StudentValidation2 = { studentValidationSchema };
