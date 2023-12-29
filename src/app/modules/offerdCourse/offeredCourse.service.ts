import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { CourseModel } from "../course/course.model";
import FacultyModel from "../faculty/faculty.model";
import { SemesterRegistrationModel } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourseModel } from "./offeredCourse.model";
import httpStatus from "http-status-codes";
import { hasTimeConflict } from "./offeredCourse.utils";
import { REGISTRATION_STATUS } from "../semesterRegistration/semesterRegistration.constance";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const isSemesterRegistrationExist = await SemesterRegistrationModel.findById(
    payload.semesterRegistration,
  );
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester Registration Not Found!",
    );
  }
  payload.academicSemester = isSemesterRegistrationExist.academicSemester;

  const isAcademicDepartmentExist = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );
  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Department Not Found!");
  }

  const isAcademicFacultyExist = await AcademicFacultyModel.findById(
    payload.academicFaculty,
  );
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty Not Found!");
  }

  const isCourseExist = await CourseModel.findById(payload.course);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Course Not Found!");
  }

  const isFacultyExist = await FacultyModel.findById(payload.faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty Not Found!");
  }

  if (
    payload.academicFaculty.toString() !==
    isAcademicDepartmentExist.academicFaculty.toString()
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Academic Faculty '${isAcademicFacultyExist.name}' is not belong on this Academic Department '${isAcademicDepartmentExist.name}'`,
    );
  }

  // check if semester registration, course, section are exist or not
  const iSSameSemesterRegistrationSameCourseSameSection =
    await OfferedCourseModel.findOne({
      semesterRegistration: payload.semesterRegistration,
      course: payload.course,
      section: payload.section,
    });
  if (iSSameSemesterRegistrationSameCourseSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section and same course is already exist!`,
    );
  }

  // check time conflict for same faculty
  const existingSchedules = await OfferedCourseModel.find({
    semesterRegistration: payload.semesterRegistration,
    faculty: payload.faculty,
    days: { $in: payload.days },
  }).select("startTime endTime days");
  // console.log(existingSchedule);
  const newSchedule = {
    days: payload.days,
    startTime: payload.startTime,
    endTime: payload.endTime,
  };
  const isTimeConflict = hasTimeConflict(existingSchedules, newSchedule);
  if (isTimeConflict) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faculty have already schedule for the same day or time. Please check day or time agin",
    );
  }

  const result = await OfferedCourseModel.create(payload);
  return result;
};
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">,
) => {
  const isOfferedCourseExist = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course Not Found!");
  }

  const semesterRegistration = await SemesterRegistrationModel.findById(
    isOfferedCourseExist.semesterRegistration,
  );
  if (semesterRegistration?.status !== REGISTRATION_STATUS.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update Offered Course due to course status is ${semesterRegistration?.status}`,
    );
  }

  const isFacultyExist = await FacultyModel.findById(payload.faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty Not Found!");
  }

  // check time conflict for same faculty
  const existingSchedules = await OfferedCourseModel.find({
    semesterRegistration: isOfferedCourseExist.semesterRegistration,
    faculty: payload.faculty,
    days: { $in: payload.days },
  }).select("startTime endTime days");
  // console.log(existingSchedule);
  const newSchedule = {
    days: payload.days,
    startTime: payload.startTime,
    endTime: payload.endTime,
  };
  const isTimeConflict = hasTimeConflict(existingSchedules, newSchedule);
  if (isTimeConflict) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faculty have already schedule for the same day or time. Please check day or time agin",
    );
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    runValidators: true,
    new: true,
  });
  return result;
};
const deleteOfferedCourseByIdFromDB = async (id: string) => {
  const isOfferedCourseExist = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course Not Found!");
  }
  const semesterRegistration = await SemesterRegistrationModel.findById(
    isOfferedCourseExist.semesterRegistration,
  );
  if (semesterRegistration?.status !== REGISTRATION_STATUS.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not delete Offered Course due to course status is ${semesterRegistration?.status}`,
    );
  }
  const result = await OfferedCourseModel.findByIdAndDelete(id);
  return result;
};
const getSingleOfferedCourseByIdFromDB = async (id: string) => {
  const result = await OfferedCourseModel.findById(id);
  return result;
};
const getOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(OfferedCourseModel.find(), query)
    .fields()
    .filter()
    .paginate()
    .sort();
  return await queryBuilder.modelQuery;
};

export const OfferedCourseService = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  getSingleOfferedCourseByIdFromDB,
  getOfferedCoursesFromDB,
  deleteOfferedCourseByIdFromDB,
};
