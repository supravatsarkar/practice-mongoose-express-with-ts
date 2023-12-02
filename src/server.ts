import mongoose from "mongoose";
import app from "./app/app";
import config from "./app/config";
console.log("config:", config);

async function main() {
  try {
    await mongoose.connect(config.databaseUrl as string);
    console.log("DB Connected..");
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log("error=>", error);
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main();
