import { Router } from "express";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidation } from "./semesterRegistration.validation";

const router = Router();

router.post(
  "/create-semester-registration",
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);
router.patch(
  "/:id",
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);
router.delete(
  "/:id",
  SemesterRegistrationController.deleteSemesterRegistration,
);
router.get(
  "/:id",
  SemesterRegistrationController.getSingleSemesterRegistration,
);
router.get("/", SemesterRegistrationController.getAllSemesterRegistration);

export const SemesterRegistrationRoute = router;
