import { Schema, model } from "mongoose";
import {
  TCourse,
  TCourseFaculties,
  TPreRequisiteCourse,
} from "./course.interface";

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourse>(
  {
    course: {
      type: Schema.ObjectId,
      required: true,
      ref: "Course",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { _id: false },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    preRequisiteCourses: [preRequisiteCourseSchema],
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

export const CourseModel = model<TCourse>("Course", courseSchema);

const courseFacultiesSchema = new Schema<TCourseFaculties>({
  course: {
    type: Schema.ObjectId,
    required: true,
    unique: true,
    ref: "Course",
  },
  faculties: [
    {
      type: Schema.ObjectId,
      required: true,
      ref: "Faculty",
    },
  ],
});

export const CourseFacultyModel = model("CourseFaculty", courseFacultiesSchema);
