import mongoose from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { COURSE_SEARCHABLE_FIELDS } from "./course.constance";
import { TCourse, TCourseFaculties } from "./course.interface";
import { CourseFacultyModel, CourseModel } from "./course.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";

const createCourseIntoDB = async (payload: TCourse) => {
  return await CourseModel.create(payload);
};
const getCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseBuilder = new QueryBuilder(
    CourseModel.find().populate("preRequisiteCourses.course"),
    query,
  )
    .sort()
    .search(COURSE_SEARCHABLE_FIELDS)
    .filter()
    .paginate()
    .fields();
  const result = await courseBuilder.modelQuery;
  const meta = await courseBuilder.totalCount();
  return { meta, result };
};
const getCourseByIdFromDB = async (id: string) => {
  return await CourseModel.findById(id).populate("preRequisiteCourses.course");
};
const updateCourseByIdFromDB = async (
  id: string,
  payload: Partial<TCourse>,
) => {
  const { preRequisiteCourses, ...remainingPayload } = payload;
  const updatedBasicCourseInfo = { ...remainingPayload };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePreRequisiteCourseIds = preRequisiteCourses
        .filter(el => el.course && el.isDeleted)
        .map(el => el.course);
      console.log("deletePreRequisiteCourseIds=>", deletePreRequisiteCourseIds);
      const addPreRequisiteCourses = preRequisiteCourses.filter(
        el => el.course && !el.isDeleted,
      );
      console.log("addPreRequestCourses=>", addPreRequisiteCourses);
      const deletedCoursesRes = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: [...deletePreRequisiteCourseIds] },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletedCoursesRes) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
      }
      const addCoursesRes = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: {
              $each: addPreRequisiteCourses,
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!addCoursesRes) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
      }
    }
    const updatedRes = await CourseModel.findByIdAndUpdate(
      id,
      updatedBasicCourseInfo,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updatedRes) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
    }

    await session.commitTransaction();
    await session.endSession();

    return updatedRes;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
const deleteCourseByIdFromDB = async (id: string) => {
  return await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
};

const assignFacultiesWithCourseIntoDB = async (
  courseId: string,
  payload: Partial<TCourseFaculties>,
) => {
  const course = await CourseModel.findById(courseId);
  // console.log("isCourseExist=>", course);
  if (!course) {
    throw new AppError(httpStatus.BAD_REQUEST, "Course ID does not exit!");
  }
  const result = CourseFacultyModel.findByIdAndUpdate(
    courseId,
    {
      course: courseId,
      $addToSet: {
        faculties: { $each: payload.faculties },
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );
  return result;
};
const getAssignFacultiesWithCourseDB = async (courseId: string) => {
  // const course = await CourseFacultyModel.findById(courseId);
  const result = CourseFacultyModel.findOne({
    course: courseId,
  }).populate("faculties");
  return result;
};
const removeFacultiesWithCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculties>,
) => {
  const result = CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: {
        faculties: { $in: payload.faculties },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const CourseService = {
  createCourseIntoDB,
  getCoursesFromDB,
  getCourseByIdFromDB,
  updateCourseByIdFromDB,
  deleteCourseByIdFromDB,
  assignFacultiesWithCourseIntoDB,
  getAssignFacultiesWithCourseDB,
  removeFacultiesWithCourseFromDB,
};
