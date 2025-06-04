"use client";
import { PDFViewer } from "@/components";
import { Container, Loading } from "@/components/assets";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { GetMongolianNameById } from "@/utils/category";
import { Clock, Folder } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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

export default function NewsDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getContent();
    }
  }, [id]);

  async function getContent() {
    try {
      setLoading(true);
      const res = await fetch(`/api/content/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        router.push("/");
        return;
      }

      const data: ContentData = await res.json();
      setContent(data);
      setDate(new Date(data.created_date));
      setError(null);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </Container>
    );
  }

  if (!content) {
    router.push("/");
    return;
  }

  return (
    <Container>
      <div className="grid grid-cols-3 my-12">
        <div className="col-span-2 flex w-full gap-8">
          <div className="space-y-6 w-full">
            {content.banner_image && (
              <Image
                src={content.banner_image || "/file.jpg"}
                alt="Banner"
                width={800}
                height={400}
                className="w-full h-auto rounded"
              />
            )}
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <Separator />
            <div className="text-sm flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <p>
                  Нийтлэгдсэн огноо:{" "}
                  {content.created_date &&
                    new Date(content.created_date).toISOString().slice(0, 10)}
                </p>
              </div>
              <div>-</div>
              <div className="flex items-center gap-2">
                <Folder size={18} />
                <p>{GetMongolianNameById(content.category_id)}</p>
              </div>
            </div>
            <Separator />
            <section className="space-y-8">
              {content.items?.map((item, index) => {
                const isImage =
                  item.image?.toLowerCase().endsWith(".jpg") ||
                  item.image?.toLowerCase().endsWith(".jpeg");
                const isPDF = item.image?.toLowerCase().endsWith(".pdf");

                return (
                  <div key={item.id || index} className="space-y-2">
                    {item.text && <p>{item.text}</p>}
                    {isImage && (
                      <Image
                        src={item.image || "/file.jpg"}
                        alt={`content-image-${index}`}
                        width={800}
                        height={400}
                        className="w-full h-auto rounded"
                      />
                    )}
                    {isPDF && <PDFViewer href={item.image} />}
                  </div>
                );
              })}
            </section>
          </div>
          <Separator orientation="vertical" />
        </div>
        <div className="col-span-1 pl-8">
          <Calendar
            mode="single"
            selected={date}
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
