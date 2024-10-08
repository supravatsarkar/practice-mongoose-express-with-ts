// import { ObjectId } from "mongoose";
import mongoose from "mongoose";
import { Types } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartmentModel } from "./academicDepartment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../builder/QueryBuilder";

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const isAcademicFacultyExist = await AcademicFacultyModel.findById(
    payload.academicFaculty,
  );
  if (!isAcademicFacultyExist)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Academic Faculty doest not exist",
    );
  return await AcademicDepartmentModel.create(payload);
};

const getAllAcademicDepartmentFromDB = async (
  query: Record<string, unknown>,
) => {
  // throw new AppError(400, "Test Error");
  const queryBuilder = new QueryBuilder(
    AcademicDepartmentModel.find().populate("academicFaculty"),
    query,
  )
    .fields()
    .filter()
    .paginate()
    .sort();
  const meta = await queryBuilder.totalCount();
  const result = await queryBuilder.modelQuery;
  return { meta, result };
};
const getSingleAcademicDepartmentByIdFromDB = async (
  id: string | Types.ObjectId,
) => {
  if (!mongoose.isValidObjectId(id))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid id!");
  return await AcademicDepartmentModel.findById(id).populate("academicFaculty");
};
const updateOneAcademicDepartmentByIdIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  if (!mongoose.isValidObjectId(id))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid id!");
  return await AcademicDepartmentModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};

export const AcademicDepartmentService = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getSingleAcademicDepartmentByIdFromDB,
  updateOneAcademicDepartmentByIdIntoDB,
};
