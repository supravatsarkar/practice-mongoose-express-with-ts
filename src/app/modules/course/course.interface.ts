import { Types } from "mongoose";

export type TPreRequisiteCourse = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  _id: Types.ObjectId;
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses: TPreRequisiteCourse[];
  isDeleted: boolean;
};

export type TCourseFaculties = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
