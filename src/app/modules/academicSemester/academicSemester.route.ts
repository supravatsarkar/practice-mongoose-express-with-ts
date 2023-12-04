import { Router } from "express";
import { AcademicSemesterController } from "./academicSemester.controller";
import { AcademicSemesterValidation } from "./academicSemester.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();
router.post(
  "/create-academic-semester",
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);
router.get("/", AcademicSemesterController.getAllAcademicSemester);
router.get("/:id", AcademicSemesterController.getAcademicSemesterById);
router.patch(
  "/:id",
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.updateOneAcademicSemesterById,
);
export const AcademicSemesterRoute = router;
