import { TStudent } from "./student.interface";
import StudentModel from "./student.model";

const countStudentFromDb = async () => {
  const result = await StudentModel.countDocuments({
    isDeleted: { $ne: true },
  });
  return result;
};
const getStudentsFromDb = async () => {
  const result = await StudentModel.find();
  return result;
};
const getSingleStudentsFromDb = async (id: string) => {
  const result = await StudentModel.aggregate([{ $match: { id } }]);
  return result;
};
const deleteStudentsFromDb = async (id: string) => {
  const result = await StudentModel.updateOne(
    { id },
    { $set: { isDeleted: true } },
  );
  return result;
};

export const StudentService = {
  // createStudentIntoDb,
  getStudentsFromDb,
  getSingleStudentsFromDb,
  deleteStudentsFromDb,
  countStudentFromDb,
};
