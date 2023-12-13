import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import mongoose from "mongoose";

const handleMongooseValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const { errors } = error;
  const errorSources: TErrorSources = Object.values(errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value.path,
        message: value.message,
      };
    },
  );
  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handleMongooseValidationError;
