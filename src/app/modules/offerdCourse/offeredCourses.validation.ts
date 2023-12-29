import { z } from "zod";
import { DAYS } from "./offeredCourse.constance";

const timeRefineSchema = z.string().refine(
  time => {
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },
  { message: "Time must be on HH:MM 24 hours format" },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...DAYS] as [string, ...string[]])),
      startTime: timeRefineSchema,
      endTime: timeRefineSchema,
    })
    .refine(
      body => {
        const start = new Date(`1993-01-01T${body.startTime}:00`);
        const end = new Date(`1993-01-01T${body.endTime}:00`);
        return end > start;
      },
      { message: "endTime should be grater then startTime" },
    ),
});
const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...DAYS] as [string, ...string[]])),
      startTime: timeRefineSchema,
      endTime: timeRefineSchema,
    })
    .refine(
      body => {
        const start = new Date(`1993-01-01T${body.startTime}:00`);
        const end = new Date(`1993-01-01T${body.endTime}:00`);
        return end > start;
      },
      { message: "endTime should be grater then startTime" },
    ),
});

export const OfferedCourseValidation = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
