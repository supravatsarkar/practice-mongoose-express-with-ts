import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AcademicDepartmentService } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentService.createAcademicDepartmentIntoDB(
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Department Created Successfully",
    data: result,
  });
});
const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentService.getAllAcademicDepartmentFromDB(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Departments fetch successfully",
    data: result,
  });
});
const getAcademicDepartmentById = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const result =
    await AcademicDepartmentService.getSingleAcademicDepartmentByIdFromDB(_id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Department fetch successfully",
    data: result,
  });
});

const updateOneAcademicDepartmentById = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const result =
    await AcademicDepartmentService.updateOneAcademicDepartmentByIdIntoDB(
      _id,
      req.body,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Department updated successfully",
    data: result,
  });
});

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getAcademicDepartmentById,
  updateOneAcademicDepartmentById,
};
