import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;
    // const { error, value } =
    //   StudentValidation.createStudentValidationSchema.validate(studentData);
    //   const validationResult =
    //     StudentValidation2.studentValidationSchema.safeParse(studentData);
    //   if (!validationResult.success) {
    //     console.log("==== Validation error==>", validationResult.error);
    //     return res.status(400).json({
    //       success: false,
    //       message: "Student creation failed",
    //       error: validationResult.error,
    //     });
    //   }
    const result = await UserService.createStudentIntoDb(password, studentData);

    return sendResponse(res, {
      success: true,
      message: "Student is created successfully",
      statusCode: httpStatus.OK,
      data: result,
    });
    // return res.status(200).json({
    //   success: true,
    //   message: "Student is created successfully",
    //   data: result,
    // });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createStudent,
};
