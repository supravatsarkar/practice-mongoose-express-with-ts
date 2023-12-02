import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "faculty", "admin"],
    },
    status: {
      type: String,
      required: true,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
    },
    needPasswordChanged: {
      type: Boolean,
      // required: true,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      // required: true,
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

const UserModel = model<TUser>("User", userSchema);

export default UserModel;
