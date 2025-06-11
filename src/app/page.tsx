"use client";
import { FAQs, Feedback, HighlightNews, NewsSub } from "@/components";
import { Container, Loading } from "@/components/assets";
import { Newspaper } from "lucide-react";
import { useEffect, useState } from "react";

interface ContentItem {
  id: number;
  text: string;
  image: string;
}
interface ContentData {
  id: number;
  title: string;
  banner_image: string;
  created_date: string;
  category_id: number;
  items: ContentItem[];
}

export default function Home() {
  const [contents, setContents] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContents();
  }, []);

  async function getContents() {
    try {
      setLoading(true);
      const res = await fetch("/api/content", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        return;
      }

      const data: ContentData[] = await res.json();
      setContents(data);
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <Container>
      <main className="py-6">
        <div className="grid grid-cols-3 w-full gap-2">
          <div className="col-span-3 lg:col-span-2  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] lg:bg-[length:18%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Онцлох мэдээ</p>
              </div>
            </div>
            <HighlightNews
              notImage={false}
              title={contents[contents.length - 1].title}
              href={`/news/${contents[contents.length - 1].id}`}
              image={contents[contents.length - 1].banner_image}
              date={contents[contents.length - 1].created_date}
            />
          </div>
          <div className="col-span-3 lg:col-span-1  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Үйл явдлын мэдээ</p>
              </div>
            </div>
            {contents
              .slice(-3)
              .reverse()
              .map((item) => (
                <NewsSub
                  key={item.id}
                  notImage={false}
                  title={item.title}
                  href={`/news/${item.id}`}
                  image={item.banner_image}
                  date={item.created_date}
                />
              ))}
          </div>
          <div className="col-span-3 lg:col-span-1  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Түгээмэл асуулт, хариулт</p>
              </div>
            </div>
            <FAQs />
          </div>
          <div className="col-span-3 lg:col-span-2  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] lg:bg-[length:18%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Тендерийн урилга</p>
              </div>
            </div>
            <NewsSub
              notImage={false}
              title="Зайсангийн зүүн гүүрийг шинээр барих ажлын явц 85 хувьтай байна"
              href="/"
              date="2025-06-11T16:00:00.000Z"
            />
          </div>
          <div className="col-span-3 border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] lg:bg-[length:12%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Санал хүсэлт</p>
              </div>
            </div>
            <Feedback />
          </div>
        </div>
      </main>
    </Container>
  );
}
