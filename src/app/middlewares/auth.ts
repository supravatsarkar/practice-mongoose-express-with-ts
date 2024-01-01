import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.const";
import UserModel from "../modules/user/user.model";

export const auth = (...userRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const accessToken = req.headers?.authorization;
    console.log({ accessToken });
    if (!accessToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
    }

    const decode = jwt.verify(accessToken, config.jwt_access_secret as string);
    console.log({ decode });
    const decodedPayload = decode as JwtPayload;
    req.user = decodedPayload;
    if (userRoles && !userRoles.includes(decodedPayload.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorize!");
    }

    const isUserExist = await UserModel.isUserExist(decodedPayload.id);
    console.log({ isUserExist });
    if (!isUserExist) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "User not exist!. You are not authorize!",
      );
    }
    if (isUserExist.isDeleted) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User is deleted. You are not authorize!",
      );
    }
    if (isUserExist.status === "blocked") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User is blocked!. You are not authorize!",
      );
    }
    if (
      UserModel.isJwtBeforeChangedPassword(
        isUserExist.passwordChangedAt,
        decodedPayload.iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User is blocked!. You are not authorize!",
      );
    }
    next();
  });
};
