"use client";
import { useEffect, useState } from "react";
import { Loading } from "./assets";
import { Container } from "@/components/assets";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { CreateContent } from "@/components";
import { Category } from "@/utils/category";

interface ContentItem {
  id: number;
  text: string;
  image: string;
}
interface ContentData {
  id: number;
  title: string;
  description: string;
  content: string;
  banner_image: string;
  type: string;
  status: string;
  created_date: string;
  category_id: number | null;
}
export const AdminContentsTable = () => {
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
        throw new Error('Failed to fetch contents');
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

  const getCategoryNameById = (id: number | null): string => {
    if (!id) return 'Ангилалгүй';
    const category = Category.find((cat) => cat.id === id);
    return category?.mongolian_name || 'Тодорхойгүй';
  };
  return (
    <Container>
      <CreateContent />
      <Table>
        <TableCaption>Нийтлэлүүд</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">№</TableHead>
            <TableHead></TableHead>
            <TableHead className="max-w-96">Гарчиг</TableHead>
            <TableHead>Төрөл</TableHead>
            <TableHead className="text-right">Нийтлэгдсэн огноо</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rounded-lg">
          {contents.map((content) => (
            <TableRow key={content.id}>
              <TableCell className="font-medium">{content.id}</TableCell>
              <TableCell className="font-medium">
                <div className="relative w-8 h-8">
                  {content.banner_image ? (
                    <Image
                      src={content.banner_image}
                      alt={`content-image-${content.id}`}
                      fill
                      className="w-full h-auto rounded object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = "/placeholder.png"; // Placeholder зургийн зам
                      }}
                    />
                  ) : (
                    <Image
                      src="/placeholder.png" // Placeholder зургийн зам
                      alt="No image"
                      fill
                      className="w-full h-auto rounded object-cover"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-96 truncate">
                {content.title}
              </TableCell>
              <TableCell>{getCategoryNameById(content.category_id)}</TableCell>
              <TableCell className="text-right">
                {new Date(content.created_date).toISOString().slice(0, 10)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Нийт</TableCell>
            <TableCell className="text-right">{contents.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Container>
  );
};
