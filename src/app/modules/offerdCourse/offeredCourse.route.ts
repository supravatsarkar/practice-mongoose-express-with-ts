import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidation } from "./offeredCourses.validation";
import { OfferedCourseController } from "./offeredCourse.controller";
import { USER_ROLES } from "../user/user.const";
import { auth } from "../../middlewares/auth";

const router = Router();
router.post(
  "/create-offered-course",
  auth(USER_ROLES.admin),
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
);
router.patch(
  "/:id",
  auth(USER_ROLES.admin),
  validateRequest(OfferedCourseValidation.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCourse,
);
router.delete(
  "/:id",
  auth(USER_ROLES.admin),
  OfferedCourseController.deleteOfferedCourse,
);
router.get("/:id", OfferedCourseController.getSingleOfferedCourse);
router.get("/", OfferedCourseController.getOfferedCourses);

export const OfferedCourseRoute = router;
