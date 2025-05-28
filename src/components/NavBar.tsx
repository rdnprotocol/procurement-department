import Image from "next/image";
import { Container, MenuBar } from "./assets";
import { Separator } from "./ui/separator";

export const NavBar = () => {
  return (
    <div className="relative bg-[#24276B] text-white font-bold text-xs">
      {/* <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:12%_auto] opacity-10 pointer-events-none" /> */}
      <div className="relative">
        <div className="relative p-0 w-full h-40 bg-contain bg-repeat bg-center bg-[url('/vectorddd.png')]">
          <Container>
            <div className="flex flex-col h-full gap-4 md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 h-20">
                <Image
                  className="rounded-full"
                  src="/logo-tov.jpeg"
                  width={80}
                  height={80}
                  alt="logo"
                />
                <p className="w-64 text-center leading-tight uppercase text-lg font-normal text-shadow-lg/50">
                  Төв аймгийн худалдан авах ажиллагааны газар
                </p>
              </div>
              {/* <div className="w-70 text-sm font-normal uppercase text-shadow-lg/50">
                Зөв төлөвлөлт, чанартай бүтээн байгуулалт, үр дүнтэй хяналт
              </div> */}
            </div>
          </Container>
        </div>
        <Separator className="bg-gray-500" />
        <Container>
          <MenuBar />
        </Container>
      </div>
    </div>
  );
};
