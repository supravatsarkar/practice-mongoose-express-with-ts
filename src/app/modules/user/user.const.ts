export const USER_ROLES = {
  student: "student",
  faculty: "faculty",
  admin: "admin",
} as const;

export type TUserRole = keyof typeof USER_ROLES;
