import dotenv from "dotenv";

dotenv.config({ path: process.cwd() + "/.env" });

export default {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  default_password: process.env.DEFAULT_PASSWORD,
};
