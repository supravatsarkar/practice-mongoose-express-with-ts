import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { SemesterRegistrationService } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.createSemesterRegistrationIntoDB(
      req.body,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Semester Registration created successfully.",
    data: result,
  });
});
const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
      id,
      req.body,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Semester Registration updated successfully.",
    data: result,
  });
});
const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationService.deleteSemesterRegistrationIntoDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Semester Registration deleted successfully.",
    data: result,
  });
});
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationService.getSemesterRegistrationByIdFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Semester Registration retrieved successfully.",
    data: result,
  });
});
const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.getSemesterRegistrationsFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Semester Registration retrieved successfully.",
    meta: result.meta,
    data: result.result,
  });
});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  updateSemesterRegistration,
  getSingleSemesterRegistration,
  getAllSemesterRegistration,
  deleteSemesterRegistration,
};
