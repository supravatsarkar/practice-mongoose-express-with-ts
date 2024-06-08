import { Schema, model } from "mongoose";
import { TUser, TUserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, TUserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "faculty", "admin", "superAdmin"],
    },
    status: {
      type: String,
      required: true,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
    },
    needPasswordChanged: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
});

userSchema.statics.isUserExist = function (id: string) {
  return this.findOne({ id }).select("+password");
};
userSchema.statics.isJwtBeforeChangedPassword = function (
  passwordChangedTimestamp: Date,
  jwtTimestamp: number,
) {
  return new Date(passwordChangedTimestamp).getTime() / 1000 > jwtTimestamp;
};

const UserModel = model<TUser, TUserModel>("User", userSchema);

export default UserModel;
