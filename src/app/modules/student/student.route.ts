import express from "express";
import { StudentController } from "./student.controller";
import { StudentValidation } from "./student.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", StudentController.getStudents);
router.get("/:id", StudentController.getSingleStudent);
router.patch(
  "/:id",
  validateRequest(StudentValidation.updateStudentValidationSchema),
  StudentController.updateSingleStudent,
);
router.delete("/:id", StudentController.deleteStudent);

export const StudentRoute = router;
