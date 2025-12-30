"use client";
import Image from "next/image";
import Link from "next/link";
import { Calendar, List } from "lucide-react";
import { getValidImagePath } from "@/utils/imageUtils";

type NewsItem = {
  id: number | string;
  title: string;
  banner_image?: string;
  created_date: string;
  items?: { text?: string }[];
};

export default function NewsGrid({ items }: { items: NewsItem[] }) {
  return (
    <div className="col-span-3">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#24276B]">Мэдээ, мэдээлэл</h2>
        <div className="w-24 h-1 bg-[#2b59d6] mx-auto mt-2 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((it) => (
          <Link key={it.id} href={`/news/${it.id}`} className="group">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-44 md:h-48">
                <Image
                  src={getValidImagePath(it.banner_image)}
                  alt={it.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 bg-[#2b59d6] text-white px-3 py-1 rounded">
                  <div className="text-xs font-semibold">{new Date(it.created_date).getFullYear()}</div>
                  <div className="text-sm">{new Date(it.created_date).toISOString().slice(5, 10)}</div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg text-[#24276B] mb-2 line-clamp-2">
                  {it.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {it.items && it.items[0]?.text ? it.items[0].text : "Товч танилцуулга байна..."}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(it.created_date).toISOString().slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <List size={14} />
                    <span>Мэдээ мэдээлэл</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
