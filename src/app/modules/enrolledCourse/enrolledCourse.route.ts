import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { EnrolledCourseValidation } from "./enrolledCourse.validation";
import { EnrolledCourseController } from "./enrolledCourse.controller";
import { USER_ROLES } from "../user/user.const";
import { auth } from "../../middlewares/auth";

const router = Router();
router.post(
  "/create-enrolled-course",
  auth(USER_ROLES.student),
  validateRequest(
    EnrolledCourseValidation.createEnrolledCourseValidationSchema,
  ),
  EnrolledCourseController.createEnrolledCourse,
);

router.patch(
  "/update-enrolled-course-marks",
  auth(USER_ROLES.faculty),
  validateRequest(EnrolledCourseValidation.updateEnrolledCourseMarksSchema),
  EnrolledCourseController.updateEnrolledCourseMarks,
);
// router.patch(
//   "/:id",
//   auth(USER_ROLES.admin),
//   validateRequest(OfferedCourseValidation.updateOfferedCourseValidationSchema),
//   OfferedCourseController.updateOfferedCourse,
// );
// router.delete(
//   "/:id",
//   auth(USER_ROLES.admin),
//   OfferedCourseController.deleteOfferedCourse,
// );
// router.get("/:id", OfferedCourseController.getSingleOfferedCourse);
router.get("/", EnrolledCourseController.getEnrolledCourse);

export const EnrolledCourseRoute = router;
