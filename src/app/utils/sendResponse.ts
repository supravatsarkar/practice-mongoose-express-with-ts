import { Response } from "express";

type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

const sendResponse = <T>(res: Response, responseData: TResponseData<T>) => {
  return res.status(responseData.statusCode).json({
    success: responseData.success,
    message: responseData.message,
    data: responseData.data,
  });
};

export default sendResponse;
