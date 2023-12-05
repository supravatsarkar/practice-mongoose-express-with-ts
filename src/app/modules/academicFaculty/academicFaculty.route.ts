import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import { AcademicFacultyController } from "./academicFaculty.controller";

const router = Router();
router.post(
  "/create-academic-faculty",
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.createAcademicFaculty,
);
router.get("/", AcademicFacultyController.getAllAcademicFaculty);
router.get("/:id", AcademicFacultyController.getAcademicFacultyById);
router.patch(
  "/:id",
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.updateOneAcademicFacultyById,
);
export const AcademicFacultyRoute = router;
