"use client";
import { useEffect } from "react";

export default function CategoryDetailsPage() {
  async function getContent() {
    const id = 1;
    const res = await fetch(`/api/content/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log(data);
  }
  useEffect(() => {
    getContent();
  });
  return <div>fd</div>;
}
