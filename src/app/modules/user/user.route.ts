import express from "express";
import { UserController } from "./user.controller";
import { StudentValidation } from "../student/student.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// interface TCustomError extends Error {
//     customMessage: string;
//     statusCode: number;
//   }
//   class CustomError extends Error {
//     customMessage: string;
//     statusCode: number;
//     constructor(message: string, customMessage: string, statusCode: number) {
//       super(message);
//       this.customMessage = customMessage;
//       this.statusCode = statusCode;
//     }
//   }

router.post(
  "/create-student",
  validateRequest(StudentValidation.createStudentValidationSchema),
  UserController.createStudent,
);

export const UserRoutes = router;
