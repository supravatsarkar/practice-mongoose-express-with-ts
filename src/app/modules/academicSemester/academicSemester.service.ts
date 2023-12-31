// import { ObjectId } from "mongoose";
import mongoose from "mongoose";
import { academicSemesterCodeMapping } from "./academicSemester.const";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterModel } from "./academicSemester.model";
import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterCodeMapping[payload.name] !== payload.code) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid semester code");
  }
  return await AcademicSemesterModel.create(payload);
};

const getAllAcademicSemesterFromDB = async () => {
  return await AcademicSemesterModel.find();
};
const getSingleAcademicSemesterByIdFromDB = async (
  id: string | Types.ObjectId,
) => {
  if (!mongoose.isValidObjectId(id))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid id!");
  return await AcademicSemesterModel.findById(id);
};
const updateOneAcademicSemesterByIdIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (!mongoose.isValidObjectId(id))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid id!");

  if (
    payload.name &&
    payload.code &&
    academicSemesterCodeMapping[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid semester code!");
  }
  return await AcademicSemesterModel.updateOne({ _id: id }, payload);
};

export const AcademicSemesterService = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterByIdFromDB,
  updateOneAcademicSemesterByIdIntoDB,
};
