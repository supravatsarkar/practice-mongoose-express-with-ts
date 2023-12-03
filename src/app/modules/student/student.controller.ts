import { StudentService } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
// import Joi from "joi";
// import { StudentValidation } from "./student.joi.validation";
// import { StudentValidation2 } from "./student.jod.validation";

const getStudents = catchAsync(async (req, res) => {
  const count = await StudentService.countStudentFromDb();
  const result = await StudentService.getStudentsFromDb();
  return sendResponse(res, {
    success: true,
    message: "Successfully retrieve students",
    statusCode: httpStatus.OK,
    data: { count, result },
  });
});
const getSingleStudent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await StudentService.getSingleStudentsFromDb(id);
  return sendResponse(res, {
    success: true,
    message: "Successfully retrieve student data",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const deleteStudent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await StudentService.deleteStudentsFromDb(id);
  return sendResponse(res, {
    success: true,
    message: "Successfully delete student data",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const StudentController = {
  getStudents,
  getSingleStudent,
  deleteStudent,
};
