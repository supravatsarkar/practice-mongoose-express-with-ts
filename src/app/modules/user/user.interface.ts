/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { Model } from "mongoose";

export type TUser = {
  id: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  role: "student" | "faculty" | "admin" | "super-admin";
  status: "in-progress" | "blocked";
  needPasswordChanged: boolean;
  isDeleted: boolean;
};

export interface TUserModel extends Model<TUser> {
  isUserExist(id: string): Promise<TUser> | null;
  isJwtBeforeChangedPassword(
    passwordChangedTimestamp: Date,
    jwtTimestamp: number,
  ): boolean;
}
