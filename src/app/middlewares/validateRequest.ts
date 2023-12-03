import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = await schema.parseAsync({
        body: req.body,
      });
      req.body = body;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
