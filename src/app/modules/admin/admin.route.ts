import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { updateAdminValidationSchema } from "./admin.validation";
import { auth } from "../../middlewares/auth";
import { USER_ROLES } from "../user/user.const";

const router = express.Router();

router.get("/", auth(USER_ROLES.admin), AdminController.getAdmins);

router.get("/:id", auth(USER_ROLES.admin), AdminController.getAdminById);

router.patch(
  "/:id",
  auth(USER_ROLES.admin),
  validateRequest(updateAdminValidationSchema),
  AdminController.updateAdmin,
);

router.delete("/:id", auth(USER_ROLES.admin), AdminController.deleteAdmin);

export const AdminRoutes = router;
