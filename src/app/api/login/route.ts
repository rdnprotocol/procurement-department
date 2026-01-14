import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string; // <-- орчиндоо заавал тохируул

export async function POST(req: Request) {
  console.log('Login API: Starting login process');
  
  const { email, password } = await req.json();
  console.log('Login API: Attempting login for email:', email);

  try {
    const supabase = createSupabaseServerClient();

    // Supabase auth ашиглан нэвтрэх
    const {
      data: { user },
      error: signInError,
    } = await supabase.auth.signInWithPassword({ email, password });

    console.log('Login API: Supabase auth result:', { 
      success: !!user, 
      error: signInError ? signInError.message : null 
    });

    if (signInError) {
      console.error("Supabase auth error:", signInError);
      return NextResponse.json(
        { error: signInError.message },
        { status: signInError.status || 400 }
      );
    }

    if (!user) {
      console.log('Login API: No user found');
      return NextResponse.json(
        { error: "Нэвтрэх нэр эсвэл нууц үг буруу байна" },
        { status: 401 }
      );
    }

    console.log('Login API: Checking user role');
    
    // Role авах (та өөрийн public.profile/users хүснэгтийнхээ нэртэй тааруул)
    const { data: roleData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)  // email-р биш id-р хайх
      .single();

    console.log('Login API: Role check result:', { roleData, roleError });

    if (roleError) {
      console.error("Role check error:", roleError);
      if (roleError.code === 'PGRST116') {
        // Хэрэглэгч олдоогүй бол шинээр үүсгэх
        const { error: insertError } = await supabase
          .from("users")
          .insert({ id: user.id, email: user.email, role: 'user' });
          
        if (insertError) {
          console.error("User insert error:", insertError);
          return NextResponse.json(
            { error: "Хэрэглэгчийн мэдээлэл үүсгэхэд алдаа гарлаа" },
            { status: 500 }
          );
        }
        // Энгийн хэрэглэгч үүсгэсэн тул админ биш
        return NextResponse.json(
          { error: "Админ эрх байхгүй байна" },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: "Эрх шалгах үед алдаа гарлаа" },
        { status: 500 }
      );
    }

    // Зөвхөн admin эрхтэй хэрэглэгчийг нэвтрүүлэх
    if (!roleData || roleData.role !== "admin") {
      return NextResponse.json(
        { error: "Админ эрх байхгүй байна" },
        { status: 403 }
      );
    }

    // JWT token үүсгэх
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new jose.SignJWT({
        id: user.id,
        email: user.email,
        role: roleData.role,
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    // Cookie дээр token хадгалах
    const response = NextResponse.json({ message: "Амжилттай нэвтэрлээ" });
    
    // HTTPS байгаа эсэхийг шалгах (domain тохируулагдсан үед secure: true болно)
    const isSecure = process.env.NODE_ENV === "production" && process.env.USE_SECURE_COOKIES === "true";
    
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: isSecure, // Domain + HTTPS тохируулсны дараа USE_SECURE_COOKIES=true болго
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 өдөр
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Системийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}
