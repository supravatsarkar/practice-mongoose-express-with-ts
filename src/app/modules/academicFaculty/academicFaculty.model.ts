import { Schema, model } from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

academicFacultySchema.pre("save", async function name(next) {
  const isExist = await this.model().findOne({ name: this.name });
  if (isExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Academic Faculty Already exit");
  next();
});
academicFacultySchema.pre("findOneAndUpdate", async function name(next) {
  const query = this.getQuery();
  const isExist = await this.model.findOne(query);
  if (!isExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Academic Faculty is not exit");
  next();
});

export const AcademicFacultyModel = model<TAcademicFaculty>(
  "AcademicFaculty",
  academicFacultySchema,
);
