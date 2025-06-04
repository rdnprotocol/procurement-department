"use client";
import { NewsSub, Path } from "@/components";
import { Container, Loading } from "@/components/assets";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { GetIdByHref, GetMongolianNameByHref } from "@/utils/category";
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

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [date] = useState<Date>(new Date());
  const [contents, setContents] = useState<ContentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getCategoryData() {
    try {
      const categoryId = GetIdByHref(id);
      if (!categoryId) {
        router.push("/");
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/category/${categoryId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        router.push("/");
        return;
      }

      const data: ContentData[] = await res.json();
      setContents(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getCategoryData();
    }
  }, [id]);

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

  if (!contents) {
    return;
  }

  return (
    <>
      <Path path={GetMongolianNameByHref(id) || "Үйл явдлын мэдээ"} />
      <Container>
        <div className="grid grid-cols-3 my-12">
          <div className="col-span-2 flex w-full gap-8">
            <div className="space-y-6 w-full">
              {contents.length > 0 ? (
                contents.map((content) => {
                  return (
                    <NewsSub
                      key={content.id}
                      notImage={false}
                      image={content.banner_image}
                      title={content.title}
                      href={`/news/${content.id}`}
                      date={content.created_date}
                    />
                  );
                })
              ) : (
                <div className="w-full text-center text-lg">
                  Мэдээ нийтлэгдээгүй байна.
                </div>
              )}
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
    </>
  );
}
