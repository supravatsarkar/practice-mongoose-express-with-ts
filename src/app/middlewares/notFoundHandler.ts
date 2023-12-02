import { Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response) => {
  // const error = new Error();
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
