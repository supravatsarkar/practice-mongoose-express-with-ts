import { Router } from "express";
import { StudentRoute } from "../modules/student/student.route";
import { UserRoutes } from "../modules/user/user.route";
import { AcademicSemesterRoute } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoute } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoute } from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoute } from "../modules/faculty/faculty.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CourseRoute } from "../modules/course/course.route";
import { SemesterRegistrationRoute } from "../modules/semesterRegistration/semesterRegistration.route";
import { OfferedCourseRoute } from "../modules/offerdCourse/offeredCourse.route";
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
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoute,
  },
  {
    path: "/faculties",
    route: FacultyRoute,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/courses",
    route: CourseRoute,
  },
  {
    path: "/semester-registrations",
    route: SemesterRegistrationRoute,
  },
  {
    path: "/offered-courses",
    route: OfferedCourseRoute,
  },
];

modules.forEach(module => router.use(module.path, module.route));
// router.use("/students", StudentRoute);
// router.use("/users", UserRoutes);

export default router;
