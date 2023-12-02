import express, { Application, Request, Response } from "express";
import cors from "cors";
import { StudentRoute } from "./app/modules/student/student.routes";
const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/students", StudentRoute);

app.get("/", (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
});

export default app;
