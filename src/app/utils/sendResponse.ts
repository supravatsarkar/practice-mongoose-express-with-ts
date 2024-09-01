import { Response } from "express";

type TMeta = {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
};

type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: TMeta;
  data: T;
};

const sendResponse = <T>(res: Response, responseData: TResponseData<T>) => {
  return res.status(responseData.statusCode).json({
    success: responseData.success,
    message: responseData.message,
    meta: responseData.meta,
    data: responseData.data,
  });
};

export default sendResponse;
