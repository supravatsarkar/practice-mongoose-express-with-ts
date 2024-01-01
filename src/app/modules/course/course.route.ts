import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseController } from "./course.controller";
import { CourseValidation } from "./course.validation";
import { auth } from "../../middlewares/auth";
import { USER_ROLES } from "../user/user.const";

const router = Router();

router.post(
  "/create-course",
  auth(USER_ROLES.admin),
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get("/", CourseController.getCourses);
router.get("/:id", CourseController.getCourseById);
router.patch("/:id", auth(USER_ROLES.admin), CourseController.updateCourse);
router.put(
  "/:courseId/assign-faculties",
  auth(USER_ROLES.admin),
  validateRequest(CourseValidation.facultiesWithCourseValidationSchema),
  CourseController.assignFaculties,
);
router.delete(
  "/:courseId/remove-faculties",
  auth(USER_ROLES.admin),
  validateRequest(CourseValidation.facultiesWithCourseValidationSchema),
  CourseController.removeFaculties,
);

router.delete("/:id", auth(USER_ROLES.admin), CourseController.deleteCourse);

export const CourseRoute = router;
