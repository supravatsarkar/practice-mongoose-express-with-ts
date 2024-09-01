import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicSemesterService } from "./academicSemester.service";
import httpStatus from "http-status-codes";

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterService.createAcademicSemesterIntoDB(
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Semester created successfully",
    data: result,
  });
});
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterService.getAllAcademicSemesterFromDB(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Semesters fetch successfully",
    meta: result.meta,
    data: result.result,
  });
});
const getAcademicSemesterById = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const result =
    await AcademicSemesterService.getSingleAcademicSemesterByIdFromDB(_id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Semester fetch successfully",
    data: result,
  });
});

const updateOneAcademicSemesterById = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const result =
    await AcademicSemesterService.updateOneAcademicSemesterByIdIntoDB(
      _id,
      req.body,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Semester updated successfully",
    data: result,
  });
});

export const AcademicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemester,
  getAcademicSemesterById,
  updateOneAcademicSemesterById,
};
