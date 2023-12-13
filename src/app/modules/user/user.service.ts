import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { AcademicSemesterService } from "../academicSemester/academicSemester.service";
import { TStudent } from "../student/student.interface";
import StudentModel from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import { generateStudentId } from "./user.utils";
import httpStatus from "http-status-codes";

const createStudentIntoDb = async (password: string, studentData: TStudent) => {
  // create a user object
  const user: Partial<TUser> = {};

  //  set password if password provided otherwise use default password
  user.password = password || (config.default_password as string);

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

export const UserService = {
  createStudentIntoDb,
};
