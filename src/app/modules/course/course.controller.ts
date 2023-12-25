import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CourseService } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseService.createCourseIntoDB(req.body);
  sendResponse(res, {
    success: true,
    message: "Course created successfully",
    statusCode: 200,
    data: result,
  });
});

const getCourseById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseService.getCourseByIdFromDB(id);
  sendResponse(res, {
    success: true,
    message: "Course retrieved successfully",
    statusCode: 200,
    data: result,
  });
});
const getCourses = catchAsync(async (req, res) => {
  const result = await CourseService.getCoursesFromDB(req.query);
  sendResponse(res, {
    success: true,
    message: "Courses retrieved successfully",
    statusCode: 200,
    data: result,
  });
});
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.updateCourseByIdFromDB(id, req.body);
  sendResponse(res, {
    success: true,
    message: "Course updated successfully",
    statusCode: 200,
    data: result,
  });
});
const deleteCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseService.deleteCourseByIdFromDB(id);
  sendResponse(res, {
    success: true,
    message: "Course deleted successfully",
    statusCode: 200,
    data: result,
  });
});
const assignFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseService.assignFacultiesWithCourseIntoDB(
    courseId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    message: "Assign Faculties successfully with course",
    statusCode: 200,
    data: result,
  });
});
const removeFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseService.removeFacultiesWithCourseFromDB(
    courseId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    message: "Remove Faculties successfully with course",
    statusCode: 200,
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getCourseById,
  getCourses,
  updateCourse,
  deleteCourse,
  assignFaculties,
  removeFaculties,
};
