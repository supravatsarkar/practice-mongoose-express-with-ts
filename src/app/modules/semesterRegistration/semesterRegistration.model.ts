import { Schema, model } from "mongoose";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SEMESTER_REGISTRATION_STATUS } from "./semesterRegistration.constance";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.ObjectId,
      required: true,
      unique: true,
      ref: "AcademicSemester",
    },
    status: {
      type: String,
      enum: SEMESTER_REGISTRATION_STATUS,
      default: "UPCOMING",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      default: 3,
    },
    maxCredit: {
      type: Number,
      default: 13,
    },
  },
  {},
);

export const SemesterRegistrationModel = model<TSemesterRegistration>(
  "SemesterRegistration",
  semesterRegistrationSchema,
);
