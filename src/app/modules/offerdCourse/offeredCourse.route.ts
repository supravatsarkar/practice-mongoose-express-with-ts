import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidation } from "./offeredCourses.validation";
import { OfferedCourseController } from "./offeredCourse.controller";

const router = Router();
router.post(
  "/create-offered-course",
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
);
router.patch(
  "/:id",
  validateRequest(OfferedCourseValidation.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCourse,
);
router.delete("/:id", OfferedCourseController.deleteOfferedCourse);
router.get("/:id", OfferedCourseController.getSingleOfferedCourse);
router.get("/", OfferedCourseController.getOfferedCourses);

export const OfferedCourseRoute = router;
