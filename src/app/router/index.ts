import { Router } from "express";
import { StudentRoute } from "../modules/student/student.route";
import { UserRoutes } from "../modules/user/user.route";
import { AcademicSemesterRoute } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoute } from "../modules/academicFaculty/academicFaculty.route";
const router = Router();

const modules = [
  {
    path: "/students",
    route: StudentRoute,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoute,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoute,
  },
];

modules.forEach(module => router.use(module.path, module.route));
// router.use("/students", StudentRoute);
// router.use("/users", UserRoutes);

export default router;
