import { Router } from "express";
import { StudentRoute } from "../modules/student/student.routes";
import { UserRoutes } from "../modules/user/user.routes";
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
];

modules.forEach(module => router.use(module.path, module.route));
// router.use("/students", StudentRoute);
// router.use("/users", UserRoutes);

export default router;
