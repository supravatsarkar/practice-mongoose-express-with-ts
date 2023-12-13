/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleMongoose11000Error = (error: any): TGenericErrorResponse => {
  console.log("error.message", error.message);
  const errorSources: TErrorSources = [
    {
      path: Object.keys(error.keyValue)[0] as string,
      message: `${
        Object.values(error.keyValue)[0] as string
      } is already exist.`,
    },
  ];

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handleMongoose11000Error;
