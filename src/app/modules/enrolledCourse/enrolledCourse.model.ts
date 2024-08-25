import { Schema, model } from "mongoose";
import { TCourseMarks, TEnrolledCourse } from "./enrolledCourse.interface";
import { GRADE } from "./enrolledCourse.constance";

const courseMarkSchema = new Schema<TCourseMarks>(
  {
    classTest1: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    midTerm: {
      type: Number,
      default: 0,
      min: 0,
      max: 30,
    },
    classTest2: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    finalTerm: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
  },
  {
    _id: false,
  },
);

const enrolledCourseSchema = new Schema<TEnrolledCourse>(
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
    offeredCourse: {
      type: Schema.ObjectId,
      required: true,
      ref: "OfferedCourse",
    },
    course: {
      type: Schema.ObjectId,
      required: true,
      ref: "Course",
    },
    student: {
      type: Schema.ObjectId,
      required: true,
      ref: "Student",
    },
    faculty: {
      type: Schema.ObjectId,
      required: true,
      ref: "Faculty",
    },
    isEnrolled: {
      type: Boolean,
      default: false,
    },
    courseMarks: {
      type: courseMarkSchema,
      required: true,
      default: {},
    },
    grade: {
      type: String,
      enum: GRADE,
      default: "NA",
    },
    gradePoints: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const EnrolledCourseModel = model<TEnrolledCourse>(
  "EnrolledCourse",
  enrolledCourseSchema,
);
