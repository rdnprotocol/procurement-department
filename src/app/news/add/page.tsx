// app/news/add/page.tsx
"use client";

import { useState } from "react";

export default function AddNewsPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/news", {
      method: "POST",
      body: JSON.stringify({ title, date, content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success) {
      alert("Амжилттай нэмэгдлээ!");
      setTitle("");
      setDate("");
      setContent("");
    } else {
      alert("Алдаа гарлаа: " + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Мэдээ нэмэх</h1>
      <input
        placeholder="Гарчиг"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border w-full p-2 mb-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border w-full p-2 mb-2"
      />
      <textarea
        placeholder="Агуулга"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border w-full p-2 mb-2 h-40"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Нэмэх
      </button>
    </form>
  );
}
