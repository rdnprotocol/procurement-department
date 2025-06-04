import { FAQs, Feedback, HighlightNews, NewsSub } from "@/components";
import { Container } from "@/components/assets";
import { Newspaper } from "lucide-react";

export default function Home() {
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
              title="Зайсангийн зүүн гүүрийг шинээр барих ажлын явц 85 хувьтай байна"
              href="/"
              image="/news-image-1.jpg"
              date="2025-06-11T16:00:00.000Z"
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
            <NewsSub
              notImage={false}
              title="Зайсангийн зүүн гүүрийг шинээр барих ажлын явц 85 хувьтай байна"
              href="/"
              image="/news-image-1.jpg"
              date="2025-06-11T16:00:00.000Z"
            />
            <NewsSub
              notImage={false}
              title="Зайсангийн зүүн гүүрийг шинээр барих ажлын явц 85 хувьтай байна"
              href="/"
              date="2025-06-11T16:00:00.000Z"
            />
            <NewsSub
              notImage={false}
              title="Зайсангийн зүүн гүүрийг шинээр барих ажлын явц 85 хувьтай байна"
              href="/"
              date="2025-06-11T16:00:00.000Z"
            />
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
