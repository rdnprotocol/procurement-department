"use client";
import Link from "next/link";
import { Calendar, Link as LinkIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TenderItem = {
  id: string;
  title: string;
  desc: string;
  date: string;
  href: string;
};

// sample items; replace with props or fetch from API as needed
const SAMPLE_ITEMS: TenderItem[] = [
  {
    id: "1",
    title: "TXAAF/202304059/01/0 ...",
    desc: "Балж голд төмөр бетон гүүр шинээр барих зураг төсөв /Хэнтий, Дадал сум/",
    date: "2023-05-09",
    href: "/",
  },
  {
    id: "2",
    title: "TXAAF/202304089/01/0 ...",
    desc: "Сургуулийн барилгын өргөтгөл, 960 суудал - Дархан-Уул, Дархан сум...",
    date: "2023-05-08",
    href: "/",
  },
  {
    id: "3",
    title: "TXAAF/202304096/01/0 ...",
    desc: "Дархан-Уул аймгийн Дархан суманд 2 га талбайд ТЭЗҮС хийж шинээр...",
    date: "2023-05-08",
    href: "/",
  },
  {
    id: "4",
    title: "TXAAF/202305001/01/0 ...",
    desc: "Барилга байгууламжийн засвар үйлчилгээний ажил...",
    date: "2023-05-10",
    href: "/",
  },
  {
    id: "5",
    title: "TXAAF/202305002/01/0 ...",
    desc: "Сургуулийн талбайн хашаа шинэчлэх ажил...",
    date: "2023-05-11",
    href: "/",
  },
  {
    id: "6",
    title: "TXAAF/202305003/01/0 ...",
    desc: "Орон нутгийн дэд бүтцийн өргөтгөл...",
    date: "2023-05-12",
    href: "/",
  },
  // add more items to test pagination
];

export default function TenderInvitations({ items = SAMPLE_ITEMS, perPage = 3 }: { items?: TenderItem[]; perPage?: number }) {
  const [page, setPage] = useState(0);

  const totalPages = useMemo(() => Math.ceil(items.length / perPage), [items.length, perPage]);

  useEffect(() => {
    const t = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(t);
  }, [totalPages]);

  const start = page * perPage;
  const pageItems = items.slice(start, start + perPage);
  // If at end and not enough items, wrap around
  if (pageItems.length < perPage) {
    pageItems.push(...items.slice(0, perPage - pageItems.length));
  }

  return (
    <div className="col-span-3 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div className="flex items-stretch justify-center gap-8">
            {pageItems.map((it) => (
              <div
                key={it.id}
                className="bg-white rounded-lg shadow-xl p-6 border border-gray-100 w-[360px] flex flex-col hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="text-[#2b59d6] mt-1">
                    <LinkIcon size={18} />
                  </div>
                  <h3 className="font-semibold text-[#24276B] text-lg line-clamp-2">
                    {it.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mt-3 line-clamp-3 flex-1">
                  {it.desc}
                </p>

                <div className="border-t mt-4 pt-3 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{it.date}</span>
                  </div>
                  <Link href={it.href ?? `/news/${it.id}`} className="text-[#2b59d6] hover:underline">
                    Дэлгэрэнгүй
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <button
            aria-label="Prev"
            onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 bg-white p-2 rounded-full shadow"
          >
            <ChevronLeft />
          </button>
          <button
            aria-label="Next"
            onClick={() => setPage((p) => (p + 1) % totalPages)}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 bg-white p-2 rounded-full shadow"
          >
            <ChevronRight />
          </button>

          <div className="flex justify-center gap-3 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-3 w-3 rounded-full ${i === page ? "bg-[#2b59d6] scale-110" : "bg-gray-300"} transition-transform`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
