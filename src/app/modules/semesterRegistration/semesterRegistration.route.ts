import { Router } from "express";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidation } from "./semesterRegistration.validation";
import { USER_ROLES } from "../user/user.const";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/create-semester-registration",
  auth(USER_ROLES.admin, USER_ROLES.superAdmin),
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);
router.patch(
  "/:id",
  auth(USER_ROLES.admin, USER_ROLES.superAdmin),
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);
router.delete(
  "/:id",
  auth(USER_ROLES.admin, USER_ROLES.superAdmin),
  SemesterRegistrationController.deleteSemesterRegistration,
);
router.get(
  "/:id",
  SemesterRegistrationController.getSingleSemesterRegistration,
);
router.get("/", SemesterRegistrationController.getAllSemesterRegistration);

export const SemesterRegistrationRoute = router;
