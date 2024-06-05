import config from "../config";
import UserModel from "../modules/user/user.model";

const seedSuperAdmin = async () => {
  const superAdminData = {
    id: "0001",
    email: config.super_admin_email,
    password: config.super_admin_password,
    role: "superAdmin",
    status: "in-progress",
    needPasswordChanged: false,
    isDeleted: false,
  };
  const isSuperAdminExist = await UserModel.findOne({ role: "superAdmin" });
  console.log("isSuperAdminExist=>", isSuperAdminExist);
  if (!isSuperAdminExist) {
    const superAdmin = await UserModel.create(superAdminData);
    console.log("super admin seeded!", superAdmin);
  }
};

export default seedSuperAdmin;
