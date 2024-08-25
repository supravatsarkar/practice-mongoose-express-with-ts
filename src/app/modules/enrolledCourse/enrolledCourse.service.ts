import mongoose from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { OfferedCourseModel } from "../offerdCourse/offeredCourse.model";
import StudentModel from "../student/student.model";
import { EnrolledCourseModel } from "./enrolledCourse.model";
import httpStatus from "http-status-codes";
import { SemesterRegistrationModel } from "../semesterRegistration/semesterRegistration.model";
import { CourseModel } from "../course/course.model";
import { TCourseMarks, TEnrolledCourse } from "./enrolledCourse.interface";
import FacultyModel from "../faculty/faculty.model";
import { calculateGradeAndGradePoint } from "./enrolledCourse.utils";

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: { offeredCourse: string },
) => {
  const isOfferedCourseExist = await OfferedCourseModel.findById(
    payload.offeredCourse,
  );
  // console.log("isOfferedCourseExist=>", isOfferedCourseExist);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course Not Found!");
  }
  const student = await StudentModel.findOne({
    id: userId,
  }).select("_id");
  const user_id = student?._id;
  // console.log("user_id", user_id);
  const isEnrolledCourseExist = await EnrolledCourseModel.findOne({
    student: user_id,
    offeredCourse: payload.offeredCourse,
    academicSemester: isOfferedCourseExist.academicSemester,
    academicDepartment: isOfferedCourseExist.academicDepartment,
  });
  // console.log("isEnrolledCourseExist=>", isEnrolledCourseExist);

  if (isEnrolledCourseExist) {
    throw new AppError(httpStatus.CONFLICT, "Student is already enrolled!");
  }

  if (isOfferedCourseExist.maxCapacity <= 0) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Room is full!");
  }

  const course = await CourseModel.findById(isOfferedCourseExist.course).select(
    "credits",
  );
  const currentCourseCredits = course?.credits;

  const semesterRegistration = await SemesterRegistrationModel.findById(
    isOfferedCourseExist.semesterRegistration,
  ).select("maxCredit");

  const maxCredit = semesterRegistration?.maxCredit;
  const totalEnrolledCourses = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExist.semesterRegistration,
        student: user_id,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "enrolledCourse",
      },
    },
    {
      $unwind: { path: "$enrolledCourse" },
    },
    {
      $group: {
        _id: null,
        totalEnrolledCourseCredits: { $sum: "$enrolledCourse.credits" },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCourseCredits: 1,
      },
    },
  ]);
  const totalEnrolledCourseCredits = totalEnrolledCourses.length
    ? totalEnrolledCourses[0].totalEnrolledCourseCredits
    : 0;
  if (
    maxCredit &&
    totalEnrolledCourseCredits + currentCourseCredits > maxCredit
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your max credit is over!");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: isOfferedCourseExist.semesterRegistration,
          academicSemester: isOfferedCourseExist.academicSemester,
          academicFaculty: isOfferedCourseExist.academicFaculty,
          academicDepartment: isOfferedCourseExist.academicDepartment,
          offeredCourse: payload.offeredCourse,
          course: isOfferedCourseExist.course,
          student: user_id,
          faculty: isOfferedCourseExist.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Course Enrolment Failed!",
      );
    }

    const maxCapacity = isOfferedCourseExist.maxCapacity;
    if (result) {
      // update offered course
      await OfferedCourseModel.findByIdAndUpdate(
        payload.offeredCourse,
        { maxCapacity: maxCapacity - 1 },
        { session },
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester Registration Not Found!",
    );
  }

  const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse);
  // console.log("isOfferedCourseExist=>", isOfferedCourseExist);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course Not Found!");
  }

  const isStudentExist = await StudentModel.findById(student);
  // console.log("isOfferedCourseExist=>", isOfferedCourseExist);
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Student Not Found!");
  }

  const faculty = await FacultyModel.findOne({ id: facultyId }).select("_id");
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty Not Found!");
  }

  const isCourseBelongToFaculty = await EnrolledCourseModel.findOne({
    offeredCourse,
    semesterRegistration,
    student,
    faculty: faculty._id,
  });
  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, "You are Forbidden!");
  }

  const toBeUpdatePayload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(courseMarks as TCourseMarks)) {
    toBeUpdatePayload["courseMarks." + key] = value;
  }

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } = courseMarks;
    const totalMarks = classTest1 + classTest2 + midTerm + finalTerm;
    const { grade, gradePoints } = calculateGradeAndGradePoint(totalMarks);
    toBeUpdatePayload.grade = grade;
    toBeUpdatePayload.gradePoints = gradePoints;
    toBeUpdatePayload.isCompleted = true;
  }

  const result = await EnrolledCourseModel.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    { ...toBeUpdatePayload },
    { new: true },
  );
  return result;
};
const getEnrolledCoursesFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(EnrolledCourseModel.find(), query)
    .fields()
    .filter()
    .paginate()
    .sort();
  const meta = await queryBuilder.totalCount();
  const result = await queryBuilder.modelQuery;
  return { meta, result };
};

export const EnrolledCourseService = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  getEnrolledCoursesFromDB,
};
