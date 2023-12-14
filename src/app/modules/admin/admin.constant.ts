import { TAdminBloodGroup, TAdminGender } from "./admin.interface";

export const GENDER: TAdminGender[] = ["male", "male", "other"];

export const BLOOD_GROUP: TAdminBloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const ADMIN_SEARCHABLE_FIELDS = [
  "email",
  "id",
  "contactNo",
  "emergencyContactNo",
  "name.firstName",
  "name.lastName",
  "name.middleName",
];
