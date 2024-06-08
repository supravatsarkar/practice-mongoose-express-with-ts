import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  const result = await UserService.createStudentIntoDb(
    password,
    studentData,
    req.file,
  );

  return sendResponse(res, {
    success: true,
    message: "Student is created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const createFaculty = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await UserService.createFacultyIntoDb(body, req.file);

  return sendResponse(res, {
    success: true,
    message: "Faculty is created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await UserService.createAdminIntoDb(body, req.file);

  return sendResponse(res, {
    success: true,
    message: "Admin is created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const getMe = catchAsync(async (req, res) => {
  const { role, id } = req.user as JwtPayload;
  const result = await UserService.getMe(role, id);

  return sendResponse(res, {
    success: true,
    message: "User retrieved successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
};
