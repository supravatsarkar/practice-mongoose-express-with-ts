import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import StudentModel from "./student.model";
import UserModel from "../user/user.model";
import mongoose from "mongoose";
import { TStudent } from "./student.interface";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const countStudentFromDb = async () => {
  const result = await getStudentsFromDb;
  return result;
};
const getStudentsFromDb = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(StudentModel.find(), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  const populatedQuery = queryBuilder.modelQuery
    .populate("user")
    .populate("academicSemester")
    .populate({ path: "academicDepartment", populate: "academicFaculty" });
  // const countQuery = new QueryBuilder(StudentModel.find(), query)
  //   .search(studentSearchableFields)
  //   .filter();
  const meta = await queryBuilder.totalCount();
  const result = await populatedQuery;
  return { meta, result };
};
const getSingleStudentsFromDb = async (id: string) => {
  const result = await StudentModel.findById(id)
    .populate("user")
    .populate("academicSemester")
    .populate({ path: "academicDepartment", populate: "academicFaculty" });
  return result;
};
const updateSingleStudentIntoDb = async (
  id: string,
  payload: Partial<TStudent>,
) => {
  if (!(await StudentModel.isStudentExist(id)))
    throw new AppError(httpStatus.BAD_REQUEST, "Student does not exist!");

  const { name, localGuardian, guardian, ...restFields } = payload;

  const updateField: Record<string, unknown> = restFields;
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updateField[`name.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      updateField[`localGuardian.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      updateField[`guardian.${key}`] = value;
    }
  }

  return await StudentModel.findByIdAndUpdate(id, updateField, {
    new: true,
    runValidators: true,
  });
};
const deleteStudentsFromDb = async (id: string) => {
  if (!(await StudentModel.isStudentExist(id)))
    throw new AppError(httpStatus.BAD_REQUEST, "Student does not exist!");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const studentRes = await StudentModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!studentRes)
      throw new AppError(
        httpStatus.REQUEST_TIMEOUT,
        "Student deletion failed! Try Again",
      );
    const userRes = await UserModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!userRes)
      throw new AppError(
        httpStatus.REQUEST_TIMEOUT,
        "Student deletion failed! Try Again",
      );

    await session.commitTransaction();
    await session.endSession();
    return studentRes;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const StudentService = {
  getStudentsFromDb,
  getSingleStudentsFromDb,
  deleteStudentsFromDb,
  countStudentFromDb,
  updateSingleStudentIntoDb,
};
