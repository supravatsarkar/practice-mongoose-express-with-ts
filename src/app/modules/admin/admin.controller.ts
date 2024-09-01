import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAdminById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminService.getAdminByIdFromDb(id);
  sendResponse(res, {
    success: true,
    message: "Admin retrieved successfully",
    statusCode: 200,
    data: result,
  });
});
const getAdmins = catchAsync(async (req, res) => {
  const result = await AdminService.getAdminsFromDb(req.query);
  sendResponse(res, {
    success: true,
    message: "Admin retrieved successfully",
    statusCode: 200,
    meta: result.meta,
    data: result.result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminService.updateAdminByIdFromDb(id, req.body);
  sendResponse(res, {
    success: true,
    message: "Admin updated successfully",
    statusCode: 200,
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminService.deleteAdminByIdFromDb(id);
  sendResponse(res, {
    success: true,
    message: "Admin deleted successfully",
    statusCode: 200,
    data: result,
  });
});

export const AdminController = {
  getAdminById,
  getAdmins,
  updateAdmin,
  deleteAdmin,
};
