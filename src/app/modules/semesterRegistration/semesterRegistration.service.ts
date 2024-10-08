import AppError from "../../errors/AppError";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import httpStatus from "http-status-codes";
import { SemesterRegistrationModel } from "./semesterRegistration.model";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { REGISTRATION_STATUS } from "./semesterRegistration.constance";
import { OfferedCourseModel } from "../offerdCourse/offeredCourse.model";
import mongoose from "mongoose";

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  // checking any ONGOING or UPCOMING semester registration exist
  const isOngoingOrUpcomingSemesterExist =
    await SemesterRegistrationModel.findOne({
      $or: [
        { status: REGISTRATION_STATUS.ONGOING },
        { status: REGISTRATION_STATUS.UPCOMING },
      ],
    });
  if (isOngoingOrUpcomingSemesterExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Already a Semester Registration is ${isOngoingOrUpcomingSemesterExist.status}`,
    );
  }
  // checking Academic semester existing
  const isAcademicSemesterExist = await AcademicSemesterModel.findById(
    payload.academicSemester,
  );
  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not exist");
  }
  // checking is any semester registration exist with provided academic semester
  const isSemesterRegistrationExist = await SemesterRegistrationModel.findOne({
    academicSemester: payload.academicSemester,
  });
  if (isSemesterRegistrationExist) {
    throw new AppError(httpStatus.CONFLICT, "Semester already registered");
  }
  const result = await SemesterRegistrationModel.create(payload);
  return result;
};
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const semesterRegistration = await SemesterRegistrationModel.findById(id);
  if (!semesterRegistration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester Registration not found!",
    );
  }
  if (semesterRegistration.status === REGISTRATION_STATUS.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Semester Registration Already ENDED",
    );
  }
  if (
    (semesterRegistration.status === REGISTRATION_STATUS.ONGOING &&
      payload?.status === REGISTRATION_STATUS.UPCOMING) ||
    (semesterRegistration.status === REGISTRATION_STATUS.UPCOMING &&
      payload?.status === REGISTRATION_STATUS.ENDED)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update Semester Registration from ${semesterRegistration.status} to ${payload?.status}`,
    );
  }
  return await SemesterRegistrationModel.findByIdAndUpdate(id, payload, {
    runValidators: true,
    new: true,
  });
};
const deleteSemesterRegistrationIntoDB = async (id: string) => {
  const semesterRegistration = await SemesterRegistrationModel.findById(id);
  if (!semesterRegistration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester Registration not found!",
    );
  }
  if (semesterRegistration.status !== REGISTRATION_STATUS.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Semester Registration Already ${semesterRegistration.status}`,
    );
  }
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    // delete all associate Offered Courses
    await OfferedCourseModel.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        session,
      },
    );

    // delete semester registration
    const result = await SemesterRegistrationModel.findByIdAndDelete(id, {
      session,
    });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return error;
  }
};
const getSemesterRegistrationByIdFromDB = async (id: string) => {
  return await SemesterRegistrationModel.findById(id).populate(
    "academicSemester",
  );
};
const getSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const queryBuilder = new QueryBuilder(
    SemesterRegistrationModel.find().populate("academicSemester"),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();
  const meta = await queryBuilder.totalCount();
  const result = await queryBuilder.modelQuery;
  return { meta, result };
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  updateSemesterRegistrationIntoDB,
  getSemesterRegistrationByIdFromDB,
  getSemesterRegistrationsFromDB,
  deleteSemesterRegistrationIntoDB,
};
