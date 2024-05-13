import mongoose from "mongoose";
import app from "./app/app";
import config from "./app/config";
import { Server } from "http";
import seedSuperAdmin from "./app/data";
console.log("config:", config);

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.databaseUrl as string);
    console.log("DB Connected..");
    /// seed super admin
    await seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log("error=>", error);
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main();

process.on("unhandledRejection", () => {
  console.log(" UnhandledRejection error detected.. Shutting down the server");
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", () => {
  console.log(" uncaughtException error detected.. ");
  process.exit(1);
});
