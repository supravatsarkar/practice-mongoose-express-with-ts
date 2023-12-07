import { z } from "zod";

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    }),
    academicFaculty: z.string({
      required_error: "Academic Faculty ID is required",
      invalid_type_error: "Academic Faculty is must be a string",
    }),
  }),
});
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Name must be a string",
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: "Academic Faculty is must be a string",
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
