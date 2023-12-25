import { z } from "zod";
const preRequisiteCoursesValidationSchema = z.object({
  course: z.string().trim(),
  isDeleted: z.boolean().optional(),
});
const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim(),
    prefix: z.string().trim(),
    code: z.number(),
    credits: z.number(),
    preRequisiteCourses: z
      .array(preRequisiteCoursesValidationSchema)
      .optional(),
  }),
});
const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().optional(),
    prefix: z.string().trim().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z
      .array(preRequisiteCoursesValidationSchema)
      .optional(),
  }),
});

const facultiesWithCourseValidationSchema = z.object({
  body: z.object({
    // course: z.string(),
    faculties: z.array(z.string()),
  }),
});

export const CourseValidation = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  facultiesWithCourseValidationSchema,
};
