import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import StudentModel from "../student/student.model";
const getLastStudentId = async (academicSemesterId: string) => {
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
  payload: TAcademicSemester & { _id: string },
) => {
  const currentId =
    (await getLastStudentId(payload._id)) || (0).toString().padStart(4, "0");
  let studentId: string | number = Number(currentId) + 1;
  studentId = studentId.toString().padStart(4, "0");
  studentId = `${payload.year}${payload.code}${studentId}`;
  return studentId;
};
