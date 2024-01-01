import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TUserRole } from "../user/user.const";
import { AuthService } from "./auth.service";
import httpStatus from "http-status-codes";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, ...rest } = await AuthService.loginUser(
    req.body,
  );
  console.log({ accessToken, refreshToken });
  res.cookie("refresh_token", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User login successfully",
    data: { accessToken, ...rest },
  });
});
const changePassword = catchAsync(async (req, res) => {
  const { ...user } = req.user;
  const result = await AuthService.changePassword(
    req.body,
    user as { role: TUserRole; id: string } & JwtPayload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refresh_token } = req.cookies;
  const result = await AuthService.refreshToken(refresh_token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "AccessToken retrieved successfully",
    data: result,
  });
});

export const AuthController = { loginUser, changePassword, refreshToken };
