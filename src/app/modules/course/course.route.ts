import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseController } from "./course.controller";
import { CourseValidation } from "./course.validation";

const router = Router();

router.post(
  "/create-course",
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get("/", CourseController.getCourses);
router.get("/:id", CourseController.getCourseById);
router.patch("/:id", CourseController.updateCourse);
router.put(
  "/:courseId/assign-faculties",
  validateRequest(CourseValidation.facultiesWithCourseValidationSchema),
  CourseController.assignFaculties,
);
router.delete(
  "/:courseId/remove-faculties",
  validateRequest(CourseValidation.facultiesWithCourseValidationSchema),
  CourseController.removeFaculties,
);

router.delete("/:id", CourseController.deleteCourse);

export const CourseRoute = router;
