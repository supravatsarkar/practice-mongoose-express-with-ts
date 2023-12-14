/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export type TAdminGender = "male" | "female" | "other";
export type TAdminBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type TAdminUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TAdmin = {
  _id: Types.ObjectId;
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TAdminUserName;
  gender: TAdminGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TAdminBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface TAdminModel extends Model<TAdmin> {
  isAdminExist(id: string): Promise<TAdmin | null>;
}
