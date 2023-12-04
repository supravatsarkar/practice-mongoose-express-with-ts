import { z } from "zod";
import {
  ACADEMIC_SEMESTER_CODE,
  ACADEMIC_SEMESTER_NAME,
  MONTHS,
} from "./academicSemester.const";

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...ACADEMIC_SEMESTER_NAME] as [string, ...string[]]),
    code: z.enum([...ACADEMIC_SEMESTER_CODE] as [string, ...string[]]),
    year: z.string(),
    startMonth: z.enum(MONTHS as [string, ...string[]]),
    endMonth: z.enum(MONTHS as [string, ...string[]]),
  }),
});
const updateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z
      .enum([...ACADEMIC_SEMESTER_NAME] as [string, ...string[]])
      .optional(),
    code: z
      .enum([...ACADEMIC_SEMESTER_CODE] as [string, ...string[]])
      .optional(),
    year: z.string().optional(),
    startMonth: z.enum(MONTHS as [string, ...string[]]).optional(),
    endMonth: z.enum(MONTHS as [string, ...string[]]).optional(),
  }),
});

export const AcademicSemesterValidation = {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterValidationSchema,
};
