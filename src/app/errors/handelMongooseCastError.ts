import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import mongoose from "mongoose";

const handleMongooseCastError = (
  error: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: error.path,
      message: error.message,
    },
  ];

  return {
    statusCode: 400,
    message: "Validation Error. Invalid Id",
    errorSources,
  };
};

export default handleMongooseCastError;
