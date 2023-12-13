/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { ZodError, ZodIssue } from "zod";
import config from "../config";
import { TErrorSources } from "../interface/error";
import handleZodError from "../errors/handelZodError";
import mongoose from "mongoose";
import handleMongooseValidationError from "../errors/handelMongooseValidationError";
import handleMongooseCastError from "../errors/handelMongooseCastError";
import handleMongoose11000Error from "../errors/handelMongoose1100Error";
import AppError from "../errors/AppError";
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log("Global Error Handler=>>", error);

  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (error instanceof ZodError) {
    console.log("==>Zod validation error");
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof mongoose.Error.ValidationError) {
    console.log("==>Mongoose validation error");
    const simplifiedError = handleMongooseValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof mongoose.Error.CastError) {
    console.log("Mongoose Cast Type Error");
    const simplifiedError = handleMongooseCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error.code === 11000) {
    console.log("Mongoose 11000 error");
    const simplifiedError = handleMongoose11000Error(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [
      {
        path: "",
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [
      {
        path: "",
        message: error.message,
      },
    ];
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: error,
    stack: config.NODE_ENV === "development" ? error?.stack : "",
  });
};

export default globalErrorHandler;
