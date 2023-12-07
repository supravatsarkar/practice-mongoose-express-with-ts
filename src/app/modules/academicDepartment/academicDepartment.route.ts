import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";
import { AcademicDepartmentController } from "./academicDepartment.controller";

const router = Router();
router.post(
  "/create-academic-department",
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.createAcademicDepartment,
);
router.get("/", AcademicDepartmentController.getAllAcademicDepartment);
router.get("/:id", AcademicDepartmentController.getAcademicDepartmentById);
router.patch(
  "/:id",
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.updateOneAcademicDepartmentById,
);
export const AcademicDepartmentRoute = router;
