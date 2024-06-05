import { Router } from "express";
import { AcademicSemesterController } from "./academicSemester.controller";
import { AcademicSemesterValidation } from "./academicSemester.validation";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { USER_ROLES } from "../user/user.const";

const router = Router();
router.post(
  "/create-academic-semester",
  auth(USER_ROLES.admin, USER_ROLES.superAdmin),
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);
router.get(
  "/",
  auth(USER_ROLES.admin, USER_ROLES.superAdmin),
  AcademicSemesterController.getAllAcademicSemester,
);
router.get("/:id", AcademicSemesterController.getAcademicSemesterById);
router.patch(
  "/:id",
  auth(USER_ROLES.admin, USER_ROLES.superAdmin),
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.updateOneAcademicSemesterById,
);
export const AcademicSemesterRoute = router;
