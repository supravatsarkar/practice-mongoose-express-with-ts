import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacultyService } from "./faculty.service";

const getFacultyById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await FacultyService.getFacultyByIdFromDb(id);
  sendResponse(res, {
    success: true,
    message: "Faculty retrieved successfully",
    statusCode: 200,
    data: result,
  });
});
const getFaculties = catchAsync(async (req, res) => {
  // console.log(req.user);
  console.log(req.cookies);
  const result = await FacultyService.getFacultiesFromDb(req.query);
  // console.log("getFaculties=>", result);
  sendResponse(res, {
    success: true,
    message: "Faculties retrieved successfully",
    statusCode: 200,
    data: result,
  });
});
const updateFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await FacultyService.updateFacultyByIdFromDb(id, req.body);
  console.log("getFaculties=>", result);
  sendResponse(res, {
    success: true,
    message: "Faculties updated successfully",
    statusCode: 200,
    data: result,
  });
});
const deleteFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await FacultyService.deleteFacultyByIdFromDb(id);
  console.log("getFaculties=>", result);
  sendResponse(res, {
    success: true,
    message: "Faculties deleted successfully",
    statusCode: 200,
    data: result,
  });
});

export const FacultyController = {
  getFacultyById,
  getFaculties,
  updateFaculty,
  deleteFaculty,
};
