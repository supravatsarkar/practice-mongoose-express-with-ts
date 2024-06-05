import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";
import { AcademicDepartmentController } from "./academicDepartment.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLES } from "../user/user.const";

const router = Router();
router.post(
  "/create-academic-department",
  auth(USER_ROLES.admin, USER_ROLES.superAdmin),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.createAcademicDepartment,
);
router.get("/", AcademicDepartmentController.getAllAcademicDepartment);
router.get("/:id", AcademicDepartmentController.getAcademicDepartmentById);
router.patch(
  "/:id",
  auth(USER_ROLES.admin),
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.updateOneAcademicDepartmentById,
);
export const AcademicDepartmentRoute = router;
