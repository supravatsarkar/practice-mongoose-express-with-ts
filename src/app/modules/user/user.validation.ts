import { z } from "zod";

const userValidationSchema = z.object({
  //   id: z.string(),
  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .max(20, { message: "Password can not be grater than 20 characters" })
    .optional(),
  //   role: z.enum(["student", "faculty", "admin"]),
  //   status: z.enum(["in-progress", "blocked"]),
  //   needPasswordChanged: z.boolean().default(true).optional(),
  //   isDeleted: z.boolean().default(false).optional(),
});
const StudentValidation = {
  userValidationSchema,
};
export default StudentValidation;
