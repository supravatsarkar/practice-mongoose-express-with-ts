import jwt from "jsonwebtoken";

export const createToken = (
  jwtPayload: Record<string, unknown>,
  jwtSecret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, jwtSecret, {
    expiresIn,
  });
};
