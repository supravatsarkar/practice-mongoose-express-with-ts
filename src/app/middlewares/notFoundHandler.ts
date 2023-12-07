import { RequestHandler } from "express";

const notFoundHandler: RequestHandler = (req, res) => {
  // const error = new AppError(httpStatus.BAD_REQUEST,);
  // error.message = "Page not found!";
  // error.statusCode = 404;
  // next(error);
  return res.status(404).json({
    success: false,
    message: "API not found!",
    error: "",
  });
};
export default notFoundHandler;
