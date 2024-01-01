import bcrypt from "bcrypt";
export const isPasswordMatch = async (
  password: string,
  hashPassword: string,
) => {
  return await bcrypt.compare(password, hashPassword);
};
