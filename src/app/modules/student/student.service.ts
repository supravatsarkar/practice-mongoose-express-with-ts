import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import StudentModel from "./student.model";
import UserModel from "../user/user.model";
import mongoose from "mongoose";
import { TStudent } from "./student.interface";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const countStudentFromDb = async () => {
  const result = await StudentModel.countDocuments({
    isDeleted: { $ne: true },
  });
  return result;
};
const getStudentsFromDb = async (query: Record<string, unknown>) => {
  // const searchFields = ["email", "name.firstName"];
  // const excludeFieldFromQuery = [
  //   "searchTerm",
  //   "limit",
  //   "sort",
  //   "page",
  //   "fields",
  // ];
  // const queryObj = { ...query };
  // excludeFieldFromQuery.forEach(field => delete queryObj[field]); // delete unwanted property from query
  // console.log({ query }, { queryObj });
  // let searchTerm = "";
  // if (query.searchTerm) {
  //   searchTerm = query.searchTerm as string;
  // }

  // const search = StudentModel.find({
  //   $or: searchFields.map(field => ({
  //     [field]: {
  //       $regex: searchTerm,
  //       $options: "i",
  //     },
  //   })),
  // })
  //   .populate("academicSemester")
  //   .populate({ path: "academicDepartment", populate: "academicFaculty" });

  // const filter = search.find(queryObj);

  // let sortQuery = "-createdAt";
  // if (query.sort) {
  //   sortQuery = query.sort as string;
  // }
  // const sort = filter.sort(sortQuery);

  // let page = 1;
  // let limit = 1;
  // let skip = 1;
  // if (Number(query.limit)) {
  //   limit = Number(query.limit);
  // }
  // if (Number(query.page)) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }
  // const skipQuery = sort.skip(skip);
  // const limitQuery = skipQuery.limit(limit);

  // let selectFields = "-__v";
  // if (query.fields) {
  //   selectFields = (query.fields as string).split(",").join(" ");
  // }
  // console.log({ selectFields });
  // const selectionQuery = limitQuery.select(selectFields);

  const queryBuilder = new QueryBuilder(StudentModel.find(), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  // console.log("queryBuilder=>", queryBuilder);
  const populatedQuery = queryBuilder.modelQuery
    .populate("academicSemester")
    .populate({ path: "academicDepartment", populate: "academicFaculty" });
  return await populatedQuery;
};
const getSingleStudentsFromDb = async (id: string) => {
  // const result = await StudentModel.aggregate([{ $match: { id } }]);
  const result = await StudentModel.findById(id)
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
  console.log({ updateField });

  return await StudentModel.findByIdAndUpdate(id, updateField, {
    new: true,
    runValidators: true,
  });
};
const deleteStudentsFromDb = async (id: string) => {
  if (!(await StudentModel.isStudentExist(id)))
    throw new AppError(httpStatus.BAD_REQUEST, "Student does not exist!");
  const session = await mongoose.startSession();
  console.log("session=>", session);
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
  // createStudentIntoDb,
  getStudentsFromDb,
  getSingleStudentsFromDb,
  deleteStudentsFromDb,
  countStudentFromDb,
  updateSingleStudentIntoDb,
};
