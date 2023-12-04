import config from "../../config";
import { AcademicSemesterService } from "../academicSemester/academicSemester.service";
import { TStudent } from "../student/student.interface";
import StudentModel from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import { generateStudentId } from "./user.utils";

const createStudentIntoDb = async (password: string, studentData: TStudent) => {
  // create a user object
  const user: Partial<TUser> = {};

  //  set password if password provided otherwise use default password
  user.password = password || (config.default_password as string);

  const academicSemester =
    await AcademicSemesterService.getSingleAcademicSemesterByIdFromDB(
      studentData.academicSemester,
    );
  if (!academicSemester) {
    throw new Error("Academic Semester is not exist!");
  }
  // set generated id
  user.id = await generateStudentId(academicSemester);

  // set role
  user.role = "student";

  //other user property by default save

  const result = await UserModel.create(user);
  // console.log({ studentData });
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
