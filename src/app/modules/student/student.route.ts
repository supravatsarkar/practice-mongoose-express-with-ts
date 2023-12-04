import express from "express";
import { StudentController } from "./student.controller";

const router = express.Router();

router.get("/", StudentController.getStudents);
router.get("/:id", StudentController.getSingleStudent);
router.delete("/:id", StudentController.deleteStudent);

export const StudentRoute = router;
