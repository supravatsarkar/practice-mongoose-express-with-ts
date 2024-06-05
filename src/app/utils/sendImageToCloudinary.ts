/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});
export const sendImageToCloudinary = (
  path: string,
  fileName: string,
): Promise<Record<string, string>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: fileName },
      function (error: unknown, result: any) {
        if (error) {
          reject(error);
        }
        console.log("cloudinary result", result);
        fs.unlink(path, error => {
          if (error) {
            console.log("File is not delete from local");
          }
          console.log("File is deleted from local");
        });
        resolve(result);
      },
    );
  });
};
