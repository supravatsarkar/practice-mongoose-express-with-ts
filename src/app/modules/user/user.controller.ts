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

export const UserController = {
  createStudent,
};
