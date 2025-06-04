import { Container } from "@/components/assets";
import { Newspaper } from "lucide-react";

export default function StructurePage() {
  return (
    <Container>
      <main className="p-6">
        <div className="grid grid-cols-2 w-full gap-2">
          <div className="col-span-1 lg:col-span-1  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:28%_auto] lg:bg-[length:28%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Эрхэм зорилго</p>
              </div>
            </div>
            <p className="text-center px-2 py-8 font-bold uppercase text-[#24276B]">
              Худалдан авах ажиллагааг ил тод, өрсөлдөх тэгш боломжтой, үр
              ашигтай, хариуцлагатай зохион байгуулахад оршино.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-1  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:28%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Алсын хараа</p>
              </div>
            </div>
            <p className="text-center px-2 py-8 font-bold uppercase text-[#24276B]">
              Нийслэлийн бүтээн байгуулалтад манлайлан оролцогч мэргэшсэн
              байгууллага байна.
            </p>
          </div>
          <div className="col-span-2 lg:col-span-2  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:14%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Чиг үүрэг</p>
              </div>
            </div>
            <ul>
              <li>
                Худалдан авах ажиллагааг ил тод, өрсөлдөх тэгш боломжтой, үр
                ашигтай, хэмнэлттэй, хариуцлагатай байх зарчимд нийцүүлэн хууль
                тогтоомжийн дагуу зохион байгуулах
              </li>
              <li>
                Төсвийн ерөнхийлөн захирагчийн худалдан авах ажиллагааны
                төлөвлөгөөг боловсруулж, батлуулах, хэрэгжүүлэх
              </li>
              <li>
                Төсвийн ерөнхийлөн захирагчийн худалдан авах ажиллагааны ерөнхий
                төлөвлөгөөг цахим системээр батлуулах, төлөвлөгөөнд өөрчлөлт
                оруулах, эрх шилжүүлэх, төлөвлөгөө батлах ажлыг холбогдох хууль,
                журмын дагуу гүйцэтгэх
              </li>
            </ul>
            <ul>
              <li>Дэлгэрэнгүй мэдээлэл авах:</li>
              <li>Нийслэлийн Худалдан авах ажиллагааны газар</li>
              <li>Захиргаа, санхүүгийн хэлтэс</li>
              <li>
                Төлөвлөгөө, тайлан хариуцсан мэргэжилтний албан үүргийг түр
                орлон гүйцэтгэгч Б.Мөнхдэлгэр
              </li>
              <li>716 тоот өрөө, Утас: 75757807</li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-2  border border-[#24276B] rounded-lg overflow-hidden">
            <div className="relative bg-[#24276B] text-white font-bold text-xs">
              <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:14%_auto] lg:bg-[length:14%_auto] opacity-10 pointer-events-none" />
              <div className="relative p-3 flex items-center text-xl gap-4">
                <Newspaper />
                <p className="uppercase">Шинэ мэдээ</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
}
