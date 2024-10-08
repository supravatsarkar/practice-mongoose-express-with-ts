/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import router from "./router";
import sendResponse from "./utils/sendResponse";
import cookieParser from "cookie-parser";
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
// app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("REQUEST======>>", req.method, req.url);
  console.log("BODY:", req.body);
  console.log("QUERY:", req.query);
  next();
});
// app.use("static", express.static(`${process.cwd()}/src/app/public`));
app.use("/static", express.static(`public`));
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    data: null,
    message: "Server is running",
    statusCode: 200,
  });
});
app.get("/test", (req: Request, res: Response) => {
  // Promise.reject("TEst");
  console.log(req.query);
  res.json(req.query);
});

app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
