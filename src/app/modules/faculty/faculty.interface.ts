import { Model, Types } from "mongoose";

export type TFaculty = {
  _id: Types.ObjectId;
  id: string;
  user: Types.ObjectId;
  name: string;
  gender: "male" | "female" | "other";
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface TFacultyModel extends Model<TFaculty> {
  // eslint-disable-next-line no-unused-vars
  isFacultyExist(id: string): Promise<TFaculty | null>;
}
