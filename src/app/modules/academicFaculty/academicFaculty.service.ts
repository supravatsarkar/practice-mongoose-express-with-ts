import mongoose from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  return await AcademicFacultyModel.create(payload);
};

const getAllAcademicFacultyFromDB = async () => {
  return await AcademicFacultyModel.find();
};
const getSingleAcademicFacultyByIdFromDB = async (id: string) => {
  if (!mongoose.isValidObjectId(id))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid id!");
  return await AcademicFacultyModel.findById(id);
};
const updateOneAcademicFacultyByIdIntoDB = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  if (!mongoose.isValidObjectId(id))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid id!");
  return await AcademicFacultyModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};

export const AcademicFacultyService = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyFromDB,
  getSingleAcademicFacultyByIdFromDB,
  updateOneAcademicFacultyByIdIntoDB,
};
