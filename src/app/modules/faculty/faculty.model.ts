import { Schema, model } from "mongoose";
import { TFaculty, TFacultyModel } from "./faculty.interface";

const facultySchema = new Schema<TFaculty, TFaculty>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.ObjectId,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
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
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

facultySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
// facultySchema.pre("findOne", function (next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

facultySchema.statics.isFacultyExist = async function (id: string) {
  console.log({ id });
  const result = await FacultyModel.findOne({ id, isDelete: { $ne: true } });
  console.log({ result });
  return result;
};

const FacultyModel = model<TFaculty, TFacultyModel>("Faculty", facultySchema);

export default FacultyModel;
