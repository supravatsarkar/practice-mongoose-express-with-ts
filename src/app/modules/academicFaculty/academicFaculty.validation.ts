import { z } from "zod";

const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Name is must be string",
      required_error: "Name must be required",
    }),
  }),
});
const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Name is must be string",
      required_error: "Name must be required",
    }),
  }),
});

export const AcademicFacultyValidation = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
