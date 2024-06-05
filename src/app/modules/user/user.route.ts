import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { StudentValidation } from "../student/student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidation } from "../faculty/faculty.validation";
import { AdminValidations } from "../admin/admin.validation";
import { auth } from "../../middlewares/auth";
import { USER_ROLES } from "./user.const";
import { fileUpload } from "../../middlewares/fileUpload";

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
  auth(USER_ROLES.admin, USER_ROLES.superAdmin),
  fileUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req.body", req.body);
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(StudentValidation.createStudentValidationSchema),
  UserController.createStudent,
);
router.post(
  "/create-faculty",
  auth(USER_ROLES.admin),
  fileUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(FacultyValidation.createFacultyValidationSchema),
  UserController.createFaculty,
);
router.post(
  "/create-admin",
  auth(USER_ROLES.superAdmin),
  fileUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);
router.get(
  "/me",
  auth(USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student),
  UserController.getMe,
);

export const UserRoutes = router;
