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
const forgotPassword = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await AuthService.forgotPassword(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reset link is generated successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const resetToken = req.headers.authorization;
  const result = await AuthService.resetPassword(
    req.body,
    resetToken as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
