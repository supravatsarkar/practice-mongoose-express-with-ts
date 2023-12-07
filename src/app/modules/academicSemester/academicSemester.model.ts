// import { Schema, model, InferSchemaType } from "mongoose";
import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import {
  ACADEMIC_SEMESTER_CODE,
  ACADEMIC_SEMESTER_NAME,
  MONTHS,
} from "./academicSemester.const";
import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";

const academicSemesterSchema = new Schema(
  {
    name: {
      type: String,
      enum: ACADEMIC_SEMESTER_NAME,
      required: true,
    },
    code: {
      type: String,
      enum: ACADEMIC_SEMESTER_CODE,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      required: true,
      enum: MONTHS,
    },
    endMonth: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// auto type define using mongoose schema infer
// type TAcademicSemesterT = InferSchemaType<typeof academicSemesterSchema>;
//

academicSemesterSchema.pre("save", async function (next) {
  const isAcademicSemesterExist = await AcademicSemesterModel.findOne({
    year: this.year,
    name: this.name,
  });
  if (isAcademicSemesterExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Semester already exist!");
  }
  next();
});
academicSemesterSchema.pre(
  "updateOne",
  // { document: true, query: false },
  async function (next) {
    const thisDoc = await this.model.findOne(this.getQuery());
    // console.log("thisDoc", thisDoc);
    const updatePayload: Partial<TAcademicSemester> = JSON.parse(
      JSON.stringify(this.getUpdate()),
    );
    if (updatePayload?.code) {
      thisDoc.code = updatePayload.code;
    }
    if (updatePayload?.name) {
      thisDoc.name = updatePayload.name;
    }
    if (updatePayload.year) {
      thisDoc.year = updatePayload.name;
    }
    if (updatePayload.startMonth) {
      thisDoc.startMonth = updatePayload.startMonth;
    }
    if (updatePayload.endMonth) {
      thisDoc.endMonth = updatePayload.endMonth;
    }
    // console.log({ updatePayload });

    const isAcademicSemesterExist = await AcademicSemesterModel.findOne({
      year: updatePayload.year,
      name: updatePayload.name,
      _id: { $ne: thisDoc._id },
    });
    if (isAcademicSemesterExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Semester already exist!");
    }
    next();
  },
);
export const AcademicSemesterModel = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema,
);
