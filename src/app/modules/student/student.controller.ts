import { NextFunction, Request, Response } from "express";
import { StudentService } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
// import Joi from "joi";
// import { StudentValidation } from "./student.joi.validation";
// import { StudentValidation2 } from "./student.jod.validation";

const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await StudentService.countStudentFromDb();
    const result = await StudentService.getStudentsFromDb();
    return sendResponse(res, {
      success: true,
      message: "Successfully retrieve students",
      statusCode: httpStatus.OK,
      data: { count, result },
    });
  } catch (error) {
    next(error);
  }
};
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await StudentService.getSingleStudentsFromDb(id);
    return sendResponse(res, {
      success: true,
      message: "Successfully retrieve student data",
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await StudentService.deleteStudentsFromDb(id);
    return sendResponse(res, {
      success: true,
      message: "Successfully delete student data",
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const StudentController = {
  getStudents,
  getSingleStudent,
  deleteStudent,
};
