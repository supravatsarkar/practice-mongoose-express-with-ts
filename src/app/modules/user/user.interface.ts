export type TUser = {
  id: string;
  password: string;
  role: "student" | "faculty" | "admin";
  status: "in-progress" | "blocked";
  needPasswordChanged: boolean;
  isDeleted: boolean;
};
