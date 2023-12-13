import { Types } from "mongoose";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import StudentModel from "../student/student.model";
import FacultyModel from "../faculty/faculty.model";
const getLastStudentId = async (academicSemesterId: Types.ObjectId) => {
  const lastStudent = await StudentModel.find(
    { academicSemester: academicSemesterId },
    { _id: 0, id: 1 },
  )
    .sort({ createdAt: -1 })
    .lean();
  const lastStudentId = lastStudent[0];
  return lastStudentId?.id.substring(6) || undefined;
};
export const generateStudentId = async (
  payload: TAcademicSemester & {
    _id: Types.ObjectId;
  },
) => {
  const currentId =
    (await getLastStudentId(payload._id)) || (0).toString().padStart(4, "0");
  let studentId: string | number = Number(currentId) + 1;
  studentId = studentId.toString().padStart(4, "0");
  studentId = `${payload.year}${payload.code}${studentId}`;
  return studentId;
};

export const generateFacultyId = async () => {
  const lastFaculty = await FacultyModel.findOne()
    .sort({
      createdAt: -1,
    })
    .lean();
  if (!lastFaculty) {
    return "F-0001";
  }
  const id = lastFaculty.id.substring(2);
  console.log({ id });
  let newId: number | string = Number(id) + 1;
  newId = "F-" + newId.toString().padStart(4, "0");
  return newId;
};
