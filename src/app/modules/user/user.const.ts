export const USER_ROLES = {
  student: "student",
  faculty: "faculty",
  admin: "admin",
  super_admin: "super_admin",
} as const;

export type TUserRole = keyof typeof USER_ROLES;
