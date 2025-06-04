"use client";
import { Container } from "@/components/assets";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Clock, Folder } from "lucide-react";
import Image from "next/image";
import React from "react";

const news = {
  bannerImage: "/news-image-1.jpg",
  title: "Шинэ журам батлагдлаа",
  content: [
    {
      text: "Шинэ журам нь ил тод байдал, үр ашигтай худалдан авалтыг дэмжих зорилготой юм.",
      image: "/news-image-1.jpg",
    },
    {
      text: "Аймгийн засаг даргын хэлснээр энэ журам ирэх сараас хэрэгжиж эхэлнэ.",
      image: "/news-image-1.jpg",
    },
  ],
  createdDate: "2025-06-02",
};

export default function HomePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  console.log(date);
  return (
    <Container>
      <div className="grid grid-cols-3 my-12">
        <div className="col-span-2 flex w-full gap-8">
          <div className="space-y-6 w-full">
            {news.bannerImage && (
              <Image
                src={news.bannerImage}
                alt="Banner"
                width={800}
                height={400}
                className="w-full h-auto rounded"
              />
            )}

            <h1 className="text-3xl font-bold">{news.title}</h1>
            <Separator />
            <div className="text-sm flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <p>Нийтлэгдсэн огноо: {news.createdDate}</p>
              </div>
              <div>-</div>
              <div className="flex items-center gap-2">
                <Folder size={18} />
                <p className="">Үйл явдлын мэдээ</p>
              </div>
            </div>

            <Separator />

            <section className="space-y-4">
              {news.content.map((block, index) => (
                <div key={index} className="space-y-2">
                  {block.image && (
                    <Image
                      src={block.image}
                      alt={`news-image-${index}`}
                      width={800}
                      height={400}
                      className="w-full h-auto rounded"
                    />
                  )}
                  {block.text && <p>{block.text}</p>}
                </div>
              ))}
            </section>
          </div>
          <Separator orientation="vertical" />
        </div>
        <div className="col-span-1 pl-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm w-fit"
          />
          <div>
            <p>Шинээр нэмэгдсэн</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
