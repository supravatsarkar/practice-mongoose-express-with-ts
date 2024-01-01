import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { AcademicSemesterService } from "../academicSemester/academicSemester.service";
import { TStudent } from "../student/student.interface";
import StudentModel from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";
import httpStatus from "http-status-codes";
import { TFaculty } from "../faculty/faculty.interface";
import bcrypt from "bcrypt";
import FacultyModel from "../faculty/faculty.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { AdminModel } from "../admin/admin.model";
import { TAdmin } from "../admin/admin.interface";

const createStudentIntoDb = async (password: string, studentData: TStudent) => {
  // create a user object
  const user: Partial<TUser> = {};

  //  set password if password provided otherwise use default password
  user.password = password || (config.default_password as string);
  // user.password = await bcrypt.hash(
  //   user.password,
  //   Number(config.bcrypt_salt_round),
  // );

  const isStudentEmailExist = await StudentModel.findOne({
    email: studentData.email,
  });
  if (isStudentEmailExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exist!");
  const academicSemester =
    await AcademicSemesterService.getSingleAcademicSemesterByIdFromDB(
      studentData.academicSemester,
    );
  if (!academicSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Academic Semester does not exist!",
    );
  }
  const academicDepartment = await AcademicDepartmentModel.findById(
    studentData.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Academic Department does not exist!",
    );
  }
  // set generated id
  user.id = await generateStudentId(academicSemester);

  // set role
  user.role = "student";
  const session = await mongoose.startSession(); // create session
  session.startTransaction(); // start transaction
  try {
    const [result] = await UserModel.create([user], { session });
    // throw new AppError(httpStatus.BAD_REQUEST, "Test Student Creation Failed!");
    // console.log({ studentData });
    if (!result._id && !result.id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Student Creation Failed!");
    }
    studentData.id = result.id;
    studentData.user = result._id;
    const [newStudent] = await StudentModel.create([studentData], { session });
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const createFacultyIntoDb = async (payload: Partial<TUser & TFaculty>) => {
  const isEmailExist = await FacultyModel.findOne({ email: payload.email });
  if (isEmailExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exist");

  if (!mongoose.isValidObjectId(payload.academicDepartment))
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid Academic Department ID",
    );
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment)
    throw new AppError(httpStatus.BAD_REQUEST, "Academic Department Not Exist");
  if (
    academicDepartment?.academicFaculty?.toString() !==
    payload?.academicFaculty?.toString()
  ) {
    // console.log(academicDepartment.academicFaculty.toString());
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Academic Faculty is not associate with Academic Department",
    );
  }
  if (
    !mongoose.isValidObjectId(payload.academicFaculty) ||
    !(await AcademicFacultyModel.findById(payload.academicFaculty))
  )
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Academic Faculty ID");

  payload.password = await bcrypt.hash(
    payload.password as string,
    Number(config.bcrypt_salt_round),
  );
  payload.id = await generateFacultyId(); // set generated id
  payload.role = "faculty"; // set role
  payload.status = "in-progress"; // set initial status
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newUser] = await UserModel.create([payload], { session });
    if (newUser._id) {
      payload.user = newUser._id;
      const [newFaculty] = await FacultyModel.create([payload], { session });
      await session.commitTransaction();
      await session.endSession();
      return newFaculty;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Faculty creation failed!");
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
const createAdminIntoDb = async (payload: Partial<TUser & TAdmin>) => {
  const isEmailExist = await AdminModel.findOne({ email: payload.email });
  if (isEmailExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exist");

  console.log("password before=>", payload.password);
  // payload.password = await bcrypt.hash(
  //   payload.password as string,
  //   Number(config.bcrypt_salt_round),
  // );
  // console.log("password before=>",  payload.password)
  payload.id = await generateAdminId(); // set generated id
  payload.role = "admin"; // set role
  payload.status = "in-progress"; // set initial status
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newUser] = await UserModel.create([payload], { session });
    if (newUser._id) {
      payload.user = newUser._id;
      const [newAdmin] = await AdminModel.create([payload], { session });
      await session.commitTransaction();
      await session.endSession();
      return newAdmin;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Admin creation failed!");
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const UserService = {
  createStudentIntoDb,
  createFacultyIntoDb,
  createAdminIntoDb,
};
