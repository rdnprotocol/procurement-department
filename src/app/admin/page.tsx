/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { AdminContentsTable } from "@/components";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface User {
  email: string;
  id?: string;
  role?: string;
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: User;

  try {
    if (!token) throw new Error("No token");
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "object" && decoded !== null && "email" in decoded) {
      user = decoded as User;
    } else {
      throw new Error("Invalid token payload");
    }
  } catch (err) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-360px-125px)] bg-white text-center px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">
          Уучлаарай, энэ хуудас олдсонгүй.
        </p>
        <Link
          href="/"
          className="bg-[#24276B] text-white px-4 py-2 rounded transition"
        >
          Нүүр хуудас руу буцах
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <AdminContentsTable />
    </div>
  );
}
