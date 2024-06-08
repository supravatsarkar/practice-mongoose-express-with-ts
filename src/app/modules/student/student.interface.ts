import { HydratedDocument, Model, Types } from "mongoose";

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TUserName;
  gender: "male" | "female" | "other";
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: "A" | "B" | "AB" | "O" | "-A" | "-B" | "-AB" | "-O";
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  academicSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
};

export type TStudentMethods = {
  isStudentExistByInstanceMethod(): Promise<TStudent | null>;
};

export interface TStudentModel
  extends Model<TStudent, Record<string, unknown>, TStudentMethods> {
  isStudentExist(
    // eslint-disable-next-line no-unused-vars
    id: string,
  ): Promise<HydratedDocument<TStudent, TStudentMethods> | null>;
}
