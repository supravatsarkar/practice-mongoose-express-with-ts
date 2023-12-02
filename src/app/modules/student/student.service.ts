import { TStudent } from "./student.interface";
import StudentModel from "./student.model";

const createStudentIntoDb = async (studentData: TStudent) => {
  // if (await StudentModel.isStudentExist(studentData.id)) {
  //   throw new Error("Student id already exist!");
  // }
  // const result = await StudentModel.create(studentData);

  // using custom instance method
  const student = new StudentModel(studentData);
  if (await student.isStudentExistByInstanceMethod()) {
    throw new Error("Student id already exist!");
  }
  const result = await student.save();

  return result;
};

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
  createStudentIntoDb,
  getStudentsFromDb,
  getSingleStudentsFromDb,
  deleteStudentsFromDb,
  countStudentFromDb,
};
