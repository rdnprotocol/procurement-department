"use client"; // Client талын component гэдгийг заах

// Шаардлагатай компонентуудыг import хийх
import { PDFViewer } from "@/components";
import { Container, Loading } from "@/components/assets";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { GetMongolianNameById } from "@/utils/category";
import { enhanceHtmlForInlinePdfEmbeds } from "@/utils/enhanceHtml";
import { Clock, Folder } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Контентын нэг item-н өгөгдлийн төрлийг тодорхойлох
interface ContentItem {
  id: number;      // Item-н дугаар
  text: string;    // Текст агуулга
  image: string;   // Зургийн зам
}

// Үндсэн контентын өгөгдлийн бүтцийг тодорхойлох
interface ContentData {
  id: number;           // Контентын дугаар
  title: string;        // Гарчиг
  description?: string; // Товч тайлбар
  content?: string;     // Дэлгэрэнгүй агуулга
  banner_image: string; // Толгой зураг
  created_date: string; // Үүсгэсэн огноо
  category_id: number;  // Ангиллын дугаар
  items: ContentItem[]; // Дэд агуулгын жагсаалт
}

// Мэдээний дэлгэрэнгүй харуулах хуудасны үндсэн component
export default function NewsDetailsPage() {
  // URL-с id параметр авах болон чиглүүлэлт хийх
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // Component-н төлөвүүдийг тодорхойлох
  const [date, setDate] = useState<Date | undefined>(new Date());         // Календарын огноо
  const [content, setContent] = useState<ContentData | null>(null);       // Контентын мэдээлэл
  const [loading, setLoading] = useState(true);                          // Ачаалж байгаа төлөв
  const [error, setError] = useState<string | null>(null);               // Алдааны мэдээлэл

  // API-с контентын мэдээлэл татах функц
  const getContent = useCallback(async () => {
    try {
      setLoading(true); // Ачаалж эхэлсэн төлөвт оруулах
      
      // API руу хүсэлт илгээх
      const res = await fetch(`/api/content/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // Хүсэлт амжилтгүй бол нүүр хуудас руу буцах
      if (!res.ok) {
        router.push("/");
        return;
      }

      // Хүсэлтийн хариуг боловсруулах
      const data: ContentData = await res.json();
      setContent(data);                           // Контентыг хадгалах
      setDate(new Date(data.created_date));       // Огноог тохируулах
      setError(null);                             // Алдааг цэвэрлэх
    } catch (err) {
      // Алдаа гарвал консол руу бичих ба алдааны төлөвт оруулах
      console.error("Error fetching content:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch content");
    } finally {
      setLoading(false); // Ачааллын төлөвийг хаах
    }
  }, [id, router]);

  // id өөрчлөгдөх болгонд контентыг дахин татах
  useEffect(() => {
    if (id) {
      getContent();
    }
  }, [id, getContent]);

  // Ачаалж байх үед Loading component харуулах
  if (loading) {
    return <Loading />;
  }

  // Алдаа гарсан үед алдааны мэдээлэл харуулах
  if (error) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </Container>
    );
  }

  // Контент олдохгүй бол нүүр хуудас руу буцах
  if (!content) {
    router.push("/");
    return;
  }

  // Үндсэн контент харуулах хэсэг
  return (
    <Container>
      <div className="grid grid-cols-3 my-12">
        {/* Зүүн талын үндсэн контент (2 багана) */}
        <div className="col-span-2 flex w-full gap-8">
          <div className="space-y-6 w-full">
            {/* Толгой зураг */}
            {content.banner_image && (
              <Image
                src={content.banner_image || "/file.jpg"}
                alt="Banner"
                width={800}
                height={400}
                className="w-full h-auto rounded"
              />
            )}
            {/* Гарчиг */}
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <Separator />
            
            {/* Мета мэдээлэл: Огноо ба ангилал */}
            <div className="text-sm flex items-center gap-4 text-gray-600">
              {/* Нийтлэгдсэн огноо */}
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <p>
                  Нийтлэгдсэн огноо:{" "}
                  {content.created_date &&
                    new Date(content.created_date).toISOString().slice(0, 10)}
                </p>
              </div>
              <div>-</div>
              {/* Ангиллын нэр */}
              <div className="flex items-center gap-2">
                <Folder size={18} />
                <p>{GetMongolianNameById(content.category_id)}</p>
              </div>
            </div>
            <Separator />

            {/* Товч тайлбар */}
            {content.description && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {content.description}
              </p>
            )}

            {/* Дэлгэрэнгүй агуулга */}
            {content.content && (
              <div 
                className="prose prose-lg max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: enhanceHtmlForInlinePdfEmbeds(content.content) }}
              />
            )}

            {/* Үндсэн агуулга - текст, зураг, PDF файлууд */}
            <section className="space-y-8">
              {content.items?.map((item, index) => {
                // Файлын төрлийг тодорхойлох
                const isImage =
                  item.image?.toLowerCase().endsWith(".jpg") ||
                  item.image?.toLowerCase().endsWith(".jpeg");
                const isPDF = item.image?.toLowerCase().endsWith(".pdf");

                return (
                  <div key={item.id || index} className="space-y-2">
                    {/* Текст агуулга */}
                    {item.text && <p>{item.text}</p>}
                    
                    {/* Хэрэв зураг бол */}
                    {isImage && (
                      <Image
                        src={item.image || "/file.jpg"}
                        alt={`content-image-${index}`}
                        width={800}
                        height={400}
                        className="w-full h-auto rounded"
                      />
                    )}
                    
                    {/* Хэрэв PDF файл бол */}
                    {isPDF && <PDFViewer href={item.image} />}
                  </div>
                );
              })}
            </section>
          </div>
          <Separator orientation="vertical" />
        </div>

        {/* Баруун талын нэмэлт мэдээлэл (1 багана) */}
        <div className="col-span-1 pl-8">
          {/* Календар */}
          <Calendar
            mode="single"
            selected={date}
            className="rounded-md border shadow-sm w-fit"
          />
          {/* Шинэ мэдээний хэсэг */}
          <div>
            <p>Шинээр нэмэгдсэн</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
