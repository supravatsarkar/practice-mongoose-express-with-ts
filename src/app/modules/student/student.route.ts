import express from "express";
import { StudentController } from "./student.controller";
import { StudentValidation } from "./student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLES } from "../user/user.const";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLES.admin, USER_ROLES.faculty),
  StudentController.getStudents,
);
router.get(
  "/:id",
  auth(USER_ROLES.admin, USER_ROLES.faculty),
  StudentController.getSingleStudent,
);
router.patch(
  "/:id",
  auth(USER_ROLES.admin, USER_ROLES.faculty),
  validateRequest(StudentValidation.updateStudentValidationSchema),
  StudentController.updateSingleStudent,
);
router.delete(
  "/:id",
  auth(USER_ROLES.admin, USER_ROLES.faculty),
  StudentController.deleteStudent,
);

export const StudentRoute = router;
