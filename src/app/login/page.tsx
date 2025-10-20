"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(""); // Clear previous error message

    try {
      console.log("Attempting login...");
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("Login response:", { status: res.status, data });

      if (res.ok) {
        console.log("Login successful, redirecting to /admin");
        router.push("/admin");
      } else {
        const errorMessage = data.error || "Login failed";
        console.error("Login failed:", errorMessage);
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Нэвтрэх үед алдаа гарлаа");
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto mt-24">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#24276B] text-white p-2 rounded"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </main>
  );
}
