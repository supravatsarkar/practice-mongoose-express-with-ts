import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyService } from "./academicFaculty.service";
import httpStatus from "http-status-codes";

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyService.createAcademicFacultyIntoDB(
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Faculty Created Successfully",
    data: result,
  });
});
const getAllAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyService.getAllAcademicFacultyFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Faculties fetch successfully",
    data: result,
  });
});
const getAcademicFacultyById = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const result =
    await AcademicFacultyService.getSingleAcademicFacultyByIdFromDB(_id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Faculty fetch successfully",
    data: result,
  });
});

const updateOneAcademicFacultyById = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const result =
    await AcademicFacultyService.updateOneAcademicFacultyByIdIntoDB(
      _id,
      req.body,
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic Faculty updated successfully",
    data: result,
  });
});

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getAcademicFacultyById,
  updateOneAcademicFacultyById,
};
