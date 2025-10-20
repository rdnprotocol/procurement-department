
import { cookies } from "next/headers";
import * as jose from 'jose';
import { AdminContentsTable } from "@/components";
import { Container } from "@/components/assets";
import CreateNewsForm from '@/components/CreateNewsForm';

const JWT_SECRET = process.env.JWT_SECRET || "procurement-department";

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
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload: decoded } = await jose.jwtVerify(token, secret);

    if (typeof decoded === "object" && decoded !== null && "email" in decoded) {
      user = decoded as unknown as User;
    } else {
      throw new Error("Invalid token payload");
    }
  } catch {
    throw new Error("Unauthorized");
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Админ удирдлага</h1>
            <p className="text-gray-600">Тавтай морил, {user.email}!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Шинэ мэдээ нэмэх</h2>
            <CreateNewsForm />
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Мэдээний жагсаалт</h2>
            <AdminContentsTable />
          </div>
        </div>
      </div>
    </Container>
  );
}
