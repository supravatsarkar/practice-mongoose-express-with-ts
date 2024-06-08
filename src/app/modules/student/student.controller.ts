import { StudentService } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

const getStudents = catchAsync(async (req, res) => {
  const result = await StudentService.getStudentsFromDb(req.query);
  return sendResponse(res, {
    success: true,
    message: "Successfully retrieve students",
    statusCode: httpStatus.OK,
    data: result,
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
const updateSingleStudent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { student } = req.body;
  const result = await StudentService.updateSingleStudentIntoDb(id, student);
  return sendResponse(res, {
    success: true,
    message: "Successfully updated student data",
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
  updateSingleStudent,
};
