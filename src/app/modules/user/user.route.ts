import express from "express";
import { UserController } from "./user.controller";
import { StudentValidation } from "../student/student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidation } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";

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
router.post(
  "/create-faculty",
  validateRequest(FacultyValidation.createFacultyValidationSchema),
  UserController.createFaculty,
);
router.post(
  "/create-admin",
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);

export const UserRoutes = router;
