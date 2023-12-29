import { Schema, model } from "mongoose";
import { TOfferedCourse } from "./offeredCourse.interface";
import { DAYS } from "./offeredCourse.constance";

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.ObjectId,
      required: true,
      ref: "SemesterRegistration",
    },
    academicSemester: {
      type: Schema.ObjectId,
      required: true,
      ref: "AcademicSemester",
    },
    academicDepartment: {
      type: Schema.ObjectId,
      required: true,
      ref: "AcademicDepartment",
    },
    academicFaculty: {
      type: Schema.ObjectId,
      required: true,
      ref: "AcademicFaculty",
    },
    course: {
      type: Schema.ObjectId,
      required: true,
      ref: "Course",
    },
    faculty: {
      type: Schema.ObjectId,
      required: true,
      ref: "Faculty",
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    section: {
      type: Number,
      required: true,
    },
    days: Array({
      type: String,
      enum: DAYS,
    }),
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const OfferedCourseModel = model<TOfferedCourse>(
  "OfferedCourse",
  offeredCourseSchema,
);
