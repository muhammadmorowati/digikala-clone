import { User } from "@/src/utils/types";

export const mockUsers: User[] = [
  {
    _id: "u1",
    name: "ادمین اصلی",
    email: "admin@example.com",
    phone: "09120000000",
    role: "ADMIN",
    avatar: "/images/avatar.png",
    password: "123456",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];