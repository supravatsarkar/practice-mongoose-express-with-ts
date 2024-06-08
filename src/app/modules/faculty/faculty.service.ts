import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { TFaculty } from "./faculty.interface";
import FacultyModel from "./faculty.model";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../builder/QueryBuilder";
import UserModel from "../user/user.model";

const getFacultyByIdFromDb = async (id: string) => {
  const isExist = await FacultyModel.isFacultyExist(id);
  if (!isExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Faculty ID");
  const result = await FacultyModel.findById({ id })
    .populate("academicFaculty")
    .populate({ path: "academicDepartment", populate: "academicFaculty" });
  return result;
};
const getFacultiesFromDb = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(FacultyModel.find(), query)
    .paginate()
    .search(["name", "email", "contactNo"])
    .sort()
    .filter()
    .fields();
  const countQueryBuilder = new QueryBuilder(FacultyModel.find(), query)
    .search(["name", "email", "contactNo"])
    .filter();
  const result = await queryBuilder.modelQuery.populate([
    "academicFaculty",
    "academicDepartment",
  ]);
  return {
    count: await countQueryBuilder.modelQuery.countDocuments(),
    faculties: result,
  };
};
const updateFacultyByIdFromDb = async (
  id: string,
  payload: Partial<TFaculty>,
) => {
  if (!(await FacultyModel.isFacultyExist(id)))
    throw new AppError(httpStatus.BAD_REQUEST, "Faculty does not exist!");

  const { ...restFields } = payload;

  const updateField: Record<string, unknown> = restFields;
  //   if (name && Object.keys(name).length) {
  //     for (const [key, value] of Object.entries(name)) {
  //       updateField[`name.${key}`] = value;
  //     }
  //   }
  //   if (localGuardian && Object.keys(localGuardian).length) {
  //     for (const [key, value] of Object.entries(localGuardian)) {
  //       updateField[`localGuardian.${key}`] = value;
  //     }
  //   }
  //   if (guardian && Object.keys(guardian).length) {
  //     for (const [key, value] of Object.entries(guardian)) {
  //       updateField[`guardian.${key}`] = value;
  //     }
  //   }
  console.log({ updateField });

  return await FacultyModel.findByIdAndUpdate(id, updateField, {
    new: true,
    runValidators: true,
  });
};
const deleteFacultyByIdFromDb = async (id: string) => {
  if (!(await FacultyModel.isFacultyExist(id)))
    throw new AppError(httpStatus.BAD_REQUEST, "Faculty does not exist!");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const facultyDelRes = await FacultyModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!facultyDelRes)
      throw new AppError(
        httpStatus.REQUEST_TIMEOUT,
        "Faculty deletion failed! Try Again",
      );
    const userRes = await UserModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!userRes)
      throw new AppError(
        httpStatus.REQUEST_TIMEOUT,
        "Faculty deletion failed! Try Again",
      );

    await session.commitTransaction();
    await session.endSession();
    return facultyDelRes;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const FacultyService = {
  getFacultyByIdFromDb,
  getFacultiesFromDb,
  updateFacultyByIdFromDb,
  deleteFacultyByIdFromDb,
};
