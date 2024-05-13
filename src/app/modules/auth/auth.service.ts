import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import httpStatus from "http-status-codes";
import { isPasswordMatch } from "../../utils";
import config from "../../config";
import bcrypt from "bcrypt";
import { TUserRole } from "../user/user.const";
import { createToken } from "./auth.utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import sendEmail from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  const isUserExist = await UserModel.findOne({
    id: payload.id,
  }).select("+password");
  console.log({ isUserExist });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }
  if (isUserExist.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  if (!(await isPasswordMatch(payload.password, isUserExist.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is not match!");
  }

  const jwtPayload = {
    role: isUserExist.role,
    id: isUserExist.id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expire as string,
  );
  return {
    accessToken,
    refreshToken,
    ...jwtPayload,
    needPasswordChanged: isUserExist.needPasswordChanged,
  };
};

const changePassword = async (
  reqPayload: { oldPassword: string; newPassword: string },
  user: { role: TUserRole; id: string } & JwtPayload,
) => {
  const { role, id } = user;
  const getUser = await UserModel.findOne({
    role,
    id,
  }).select("+password");

  if (!getUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
  }
  if (getUser.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }
  if (getUser.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  if (!(await isPasswordMatch(reqPayload.oldPassword, getUser.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is not match!");
  }

  const newHashedPassword = await bcrypt.hash(
    reqPayload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await UserModel.findOneAndUpdate(
    { id },
    {
      password: newHashedPassword,
      needPasswordChanged: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

const refreshToken = async (refresh_token: string) => {
  let decode;
  try {
    decode = jwt.verify(refresh_token, config.jwt_refresh_secret as string);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
  }
  console.log({ decode });
  const decodedPayload = decode as JwtPayload;

  const user = await UserModel.isUserExist(decodedPayload.id);
  console.log({ user });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not exist!. You are not authorize!",
    );
  }
  if (user.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User is deleted. You are not authorize!",
    );
  }
  if (user.status === "blocked") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User is blocked!. You are not authorize!",
    );
  }
  if (
    UserModel.isJwtBeforeChangedPassword(
      user.passwordChangedAt,
      decodedPayload.iat as number,
    )
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User is blocked!. You are not authorize!",
    );
  }

  const jwtPayload = {
    role: user.role,
    id: user.id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire as string,
  );
  return {
    accessToken,
  };
};

const forgotPassword = async (id: string) => {
  const user = await UserModel.isUserExist(id);
  console.log({ user });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted.");
  }
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!.");
  }

  const jwtPayload = {
    role: user.role,
    id: user.id,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m",
  );
  const resetLink = `${config.ui_host}?id=${user.id}&token=${resetToken}`;
  console.log({ resetLink });
  const htmlTemplate = `<h5><a href="${resetLink}" target="_blank">Click here</a> to reset your password.</h5>`;
  await sendEmail(user.email, "Password reset link", htmlTemplate);
  return null;
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  resetToken: string,
) => {
  const decode = jwt.verify(resetToken, config.jwt_access_secret as string);
  console.log({ decode });
  const decodedPayload = decode as JwtPayload;
  if (payload.id !== decodedPayload.id) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden.");
  }

  const user = await UserModel.isUserExist(decodedPayload.id);
  console.log({ user });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted.");
  }
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!.");
  }

  // update password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await UserModel.findOneAndUpdate(
    { id: user.id, role: user.role },
    {
      password: newHashedPassword,
      needPasswordChanged: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
