import { FAQs, Feedback } from "@/components";
import { Container } from "@/components/assets";
import { Newspaper } from "lucide-react";

export default function Home() {
  return (
    <Container>
      <main className="p-6">
        <div className="grid grid-cols-3 w-full gap-2">
          <div className="h-24 col-span-3 lg:col-span-2  bg-blue-600 rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] lg:bg-[length:18%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Онцлох мэдээ</p>
              </div>
            </div>
          </div>
          <div className="h-24 col-span-3 lg:col-span-1  bg-blue-600 rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Үйл явдлын мэдээ</p>
              </div>
            </div>
          </div>
          <div className="h-96 col-span-3 lg:col-span-1  bg-blue-600 rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Тендерийн урилга</p>
              </div>
            </div>
          </div>
          <div className="col-span-3 lg:col-span-2  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:36%_auto] lg:bg-[length:18%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Түгээмэл асуулт, хариулт</p>
              </div>
            </div>
            <FAQs />
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
