import { Router } from "express";
import { FacultyController } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidation } from "./faculty.validation";

const router = Router();

router.get("/", FacultyController.getFaculties);
router.get("/:id", FacultyController.getFacultyById);
router.patch(
  "/:id",
  validateRequest(FacultyValidation.updateFacultyValidationSchema),
  FacultyController.updateFaculty,
);
router.delete("/:id", FacultyController.deleteFaculty);

export const FacultyRoute = router;
