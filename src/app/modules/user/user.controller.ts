import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  console.log("req.body", req.body);
  console.log("req.body.password", req.body.password);
  console.log("req.body.student", req.body.student);
  const result = await UserService.createStudentIntoDb(password, studentData);

  return sendResponse(res, {
    success: true,
    message: "Student is created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const createFaculty = catchAsync(async (req, res) => {
  const body = req.body;
  console.log("body", body);
  const result = await UserService.createFacultyIntoDb(body);

  return sendResponse(res, {
    success: true,
    message: "Faculty is created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const body = req.body;
  console.log("body", body);
  const result = await UserService.createAdminIntoDb(body);

  return sendResponse(res, {
    success: true,
    message: "Admin is created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
};
