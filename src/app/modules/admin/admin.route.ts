import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { updateAdminValidationSchema } from "./admin.validation";

const router = express.Router();

router.get("/", AdminController.getAdmins);

router.get("/:id", AdminController.getAdminById);

router.patch(
  "/:id",
  validateRequest(updateAdminValidationSchema),
  AdminController.updateAdmin,
);

router.delete("/:id", AdminController.deleteAdmin);

export const AdminRoutes = router;
