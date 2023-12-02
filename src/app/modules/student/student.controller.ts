import { Request, Response } from "express";
import { StudentService } from "./student.service";
// import Joi from "joi";
// import { StudentValidation } from "./student.joi.validation";
import { StudentValidation2 } from "./student.jod.validation";

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    // const { error, value } =
    //   StudentValidation.createStudentValidationSchema.validate(studentData);

    const validationResult =
      StudentValidation2.studentValidationSchema.safeParse(studentData);

    if (!validationResult.success) {
      console.log("==== Validation error==>", validationResult.error);
      return res.status(400).json({
        success: false,
        message: "Student creation failed",
        error: validationResult.error,
      });
    }
    const result = await StudentService.createStudentIntoDb(studentData);
    return res.status(200).json({
      success: true,
      message: "Student is created successfully",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error=>", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Student creation failed",
      error: error,
    });
  }
};

const getStudents = async (req: Request, res: Response) => {
  try {
    const count = await StudentService.countStudentFromDb();
    const result = await StudentService.getStudentsFromDb();
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: { count, result },
    });
  } catch (error) {
    console.log("Error=>", error);
    res.status(500).json({
      success: false,
      message: "failed",
      error: error,
    });
  }
};
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await StudentService.getSingleStudentsFromDb(id);
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error=>", error);
    res.status(500).json({
      success: false,
      message: "Student get failed",
      error: error,
    });
  }
};
const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await StudentService.deleteStudentsFromDb(id);
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error=>", error);
    res.status(500).json({
      success: false,
      message: "Student get failed",
      error: error,
    });
  }
};

export const StudentController = {
  createStudent,
  getStudents,
  getSingleStudent,
  deleteStudent,
};
