import z from "zod";

const userNameSchemaForCreate = z.object({
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
const userNameSchemaForUpdate = z.object({
  firstName: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine(v => v === v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), {
      message: "First Name must be capitalized+",
    })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1)
    .max(20)
    .refine(v => /^[A-Za-z]+$/.test(v), {
      message: "Last Name must be alphabet value",
    })
    .optional(),
});

// Define validation schema for Guardian
const guardianSchemaForCreate = z.object({
  fatherName: z.string().min(1),
  fatherOccupation: z.string().min(1),
  fatherContactNo: z.string().min(1),
  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherContactNo: z.string().min(1),
});
const guardianSchemaForUpdate = z.object({
  fatherName: z.string().min(1).optional(),
  fatherOccupation: z.string().min(1).optional(),
  fatherContactNo: z.string().min(1).optional(),
  motherName: z.string().min(1).optional(),
  motherOccupation: z.string().min(1).optional(),
  motherContactNo: z.string().min(1).optional(),
});

// Define validation schema for LocalGuardian
const localGuardianSchemaForCreate = z.object({
  name: z.string().min(1),
  occupation: z.string().min(1),
  contactNo: z.string().min(1),
  address: z.string().min(1),
});
const localGuardianSchemaForUpdate = z.object({
  name: z.string().min(1).optional(),
  occupation: z.string().min(1).optional(),
  contactNo: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
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
      name: userNameSchemaForCreate,
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
      guardian: guardianSchemaForCreate,
      localGuardian: localGuardianSchemaForCreate,
      // profileImg: z.string().optional(),
      academicSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});
const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: userNameSchemaForUpdate.optional(),
      gender: z
        .enum(["male", "female", "other"])
        .refine(v => v !== undefined, {
          message: "Gender is required",
        })
        .optional(),
      dateOfBirth: z.string().min(1).optional(),
      email: z.string().email().optional(),
      contactNo: z.string().min(1).optional(),
      emergencyContactNo: z.string().min(1).optional(),
      bloodGroup: z
        .enum(["A", "B", "AB", "O", "-A", "-B", "-AB", "-O"])
        .nullable()
        .optional(),
      presentAddress: z.string().min(1).optional(),
      permanentAddress: z.string().min(1).optional(),
      guardian: guardianSchemaForUpdate.optional(),
      localGuardian: localGuardianSchemaForUpdate.optional(),
      profileImg: z.string().optional(),
      academicSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const StudentValidation = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
