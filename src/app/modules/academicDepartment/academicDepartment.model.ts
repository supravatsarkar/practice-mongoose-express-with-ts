import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.ObjectId,
      required: true,
      ref: "AcademicFaculty",
    },
  },
  { timestamps: true },
);

academicDepartmentSchema.pre("save", async function name(next) {
  const isExist = await this.model().findOne({ name: this.name });
  if (isExist)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Academic Department Already exit",
    );
  next();
});
academicDepartmentSchema.pre("findOneAndUpdate", async function name(next) {
  const query = this.getQuery();
  const isExist = await this.model.findOne(query);
  if (!isExist)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Academic Department is not exit",
    );
  next();
});

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema,
);
