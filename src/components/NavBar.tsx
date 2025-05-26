import Image from "next/image";
import { Container, MenuBar } from "./assets";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { FaFacebook, FaSearch, FaTwitter, FaYoutube } from "react-icons/fa";

export const NavBar = () => {
  return (
    <div className="border-b-2 border-[#24276B]">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row justify-between items-center m-2">
          <div className="flex items-center gap-4 h-20">
            <Image src="/logo-tov.jpeg" width={80} height={80} alt="logo" />
            <Separator orientation="vertical" className="bg-[#7d8cad]" />
            <p className="w-80 uppercase text-xl font-bold text-[#5371b0]">
              Төв аймгийн худалдан авах ажиллагааны газар
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative w-80 md:w-96 rounded-full overflow-hidden">
              <Input
                placeholder="Та хайх зүйлээ энд бичнэ үү..."
                className="rounded-full px-6 pr-16 border-[#24276B] focus-visible:border-[#24276B]"
              />
              <div className="absolute top-0 right-0 w-12 h-full bg-[#24276B] flex justify-center items-center text-white cursor-pointer">
                <FaSearch size={16} />
              </div>
            </div>
            <div className="hidden lg:flex gap-4 justify-center text-[#24276B]">
              <FaYoutube className="size-4 cursor-pointer" />
              <FaTwitter className="size-4 cursor-pointer" />
              <FaFacebook className="size-4 cursor-pointer" />
            </div>
          </div>
        </div>
        <Separator />
        <MenuBar />
      </Container>
    </div>
  );
};
