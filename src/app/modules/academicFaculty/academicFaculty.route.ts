import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import { AcademicFacultyController } from "./academicFaculty.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLES } from "../user/user.const";

const router = Router();
router.post(
  "/create-academic-faculty",
  auth(USER_ROLES.admin),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.createAcademicFaculty,
);
router.get("/", AcademicFacultyController.getAllAcademicFaculty);
router.get("/:id", AcademicFacultyController.getAcademicFacultyById);
router.patch(
  "/:id",
  auth(USER_ROLES.admin),
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.updateOneAcademicFacultyById,
);
export const AcademicFacultyRoute = router;
