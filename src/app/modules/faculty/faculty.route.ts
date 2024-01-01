import { Router } from "express";
import { FacultyController } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidation } from "./faculty.validation";
import { auth } from "../../middlewares/auth";
import { USER_ROLES } from "../user/user.const";

const router = Router();

router.get("/", auth(USER_ROLES.admin), FacultyController.getFaculties);
router.get("/:id", auth(USER_ROLES.admin), FacultyController.getFacultyById);
router.patch(
  "/:id",
  auth(USER_ROLES.admin),
  validateRequest(FacultyValidation.updateFacultyValidationSchema),
  FacultyController.updateFaculty,
);
router.delete("/:id", auth(USER_ROLES.admin), FacultyController.deleteFaculty);

export const FacultyRoute = router;
