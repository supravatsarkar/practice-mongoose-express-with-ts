import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../builder/QueryBuilder";
import UserModel from "../user/user.model";
import { AdminModel } from "./admin.model";
import { ADMIN_SEARCHABLE_FIELDS } from "./admin.constant";
import { TAdmin } from "./admin.interface";

const getAdminByIdFromDb = async (id: string) => {
  const isExist = await AdminModel.isAdminExist(id);
  console.log("isExist", isExist);
  if (!isExist) throw new AppError(httpStatus.BAD_REQUEST, "Invalid Admin ID");
  const result = await AdminModel.findOne({ id });
  return result;
};
const getAdminsFromDb = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(AdminModel.find(), query)
    .paginate()
    .search(ADMIN_SEARCHABLE_FIELDS)
    .sort()
    .filter()
    .fields();
  const result = await queryBuilder.modelQuery;
  return result;
};
const updateAdminByIdFromDb = async (id: string, payload: Partial<TAdmin>) => {
  if (!(await AdminModel.isAdminExist(id)))
    throw new AppError(httpStatus.BAD_REQUEST, "Admin does not exist!");

  const { name, ...restFields } = payload;

  const updateField: Record<string, unknown> = restFields;
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      console.log({ key, value });
      updateField[`name.${key}`] = value;
    }
  }
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

  return await AdminModel.findOneAndUpdate({ id }, updateField, {
    new: true,
    runValidators: true,
  });
};
const deleteAdminByIdFromDb = async (id: string) => {
  console.log({ id });
  const isExist = await AdminModel.isAdminExist(id);
  if (!isExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Admin does not exist!");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const adminDelRes = await AdminModel.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!adminDelRes)
      throw new AppError(
        httpStatus.REQUEST_TIMEOUT,
        "Admin deletion failed! Try Again",
      );
    const userRes = await UserModel.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!userRes)
      throw new AppError(
        httpStatus.REQUEST_TIMEOUT,
        "Admin deletion failed! Try Again",
      );

    await session.commitTransaction();
    await session.endSession();
    return adminDelRes;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const AdminService = {
  getAdminByIdFromDb,
  getAdminsFromDb,
  updateAdminByIdFromDb,
  deleteAdminByIdFromDb,
};
