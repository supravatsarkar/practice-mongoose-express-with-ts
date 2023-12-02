import config from "../../config";
import { TStudent } from "../student/student.interface";
import StudentModel from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";

const createStudentIntoDb = async (password: string, studentData: TStudent) => {
  // create a user object
  const user: Partial<TUser> = {};

  //  set password if password provided otherwise use default password
  user.password = password || (config.default_password as string);

  // set generated id
  user.id = "20200202443";

  // set role
  user.role = "student";

  //other user property by default save

  const result = await UserModel.create(user);

  if (result._id && result.id) {
    studentData.id = result.id;
    studentData.user = result._id;
    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  } else {
    throw new Error("Student Creation Failed!");
  }

  // using custom instance method
  // const student = new StudentModel(studentData);
  // if (await student.isStudentExistByInstanceMethod()) {
  //   throw new Error("Student id already exist!");
  // }
  // const result = await student.save();

  //   return result;
};

export const UserService = {
  createStudentIntoDb,
};
