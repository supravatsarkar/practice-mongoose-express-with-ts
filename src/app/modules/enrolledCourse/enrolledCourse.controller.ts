import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseService } from "./enrolledCourse.service";
import httpStatus from "http-status-codes";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await EnrolledCourseService.createEnrolledCourseIntoDB(
    userId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Enrolled Course Created Successfully",
    data: result,
  });
});
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.id;
  const result = await EnrolledCourseService.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Enrolled Courses Marks Successfully Updated",
    data: result,
  });
});
const getEnrolledCourse = catchAsync(async (req, res) => {
  const result = await EnrolledCourseService.getEnrolledCoursesFromDB(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Enrolled Courses Retrieved Successfully",
    data: result,
  });
});

export const EnrolledCourseController = {
  createEnrolledCourse,
  getEnrolledCourse,
  updateEnrolledCourseMarks,
};
