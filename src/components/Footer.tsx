import { Container } from "./assets";
import { Earth, Mail, MapPin, PhoneCall } from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="relative bg-[#24276B] text-white font-bold text-xs">
      <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:12%_auto] opacity-10 pointer-events-none" />
      <div className="relative py-4 lg:h-80">
        <Container className="flex flex-col justify-between h-full">
          <div className="flex lg:flex-row flex-col gap-4 mt-12 mb-4">
            <div className="flex flex-col items-center">
              <Image
                src="/logo-bosoo-white.png"
                width={400}
                height={200}
                alt="logo"
              />
              <div className="flex gap-4 justify-center mt-8">
                <FaYoutube className="size-4 cursor-pointer" />
                <FaTwitter className="size-4 cursor-pointer" />
                <FaFacebook className="size-4 cursor-pointer" />
              </div>
            </div>
            <div className="space-y-6">
              <h1 className="text-xl uppercase">Холбоосууд</h1>
              <Separator className="min-w-36 max-w-36" />
              <a
                href="https://ub-procurement.mn/about-uss/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Earth size={16} />
                  <p>Шилэн данс</p>
                </div>
              </a>
              <a
                href="https://ub-procurement.mn/about-uss/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2 mt-4 hover:text-blue-600 transition-colors">
                  <Earth size={16} />
                  <p>Шил ажиллагаа</p>
                </div>
              </a>
            </div>
            <div className="space-y-6">
              <h1 className="text-xl uppercase">Холбоо барих</h1>
              <Separator className="min-w-36" />
              <a
                href="https://maps.app.goo.gl/9BbHsXsCJ1e4ehv3A"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2 mt-2 hover:text-blue-600 transition-colors">
                  <MapPin size={16} className="min-w-4" />
                  <p>
                    Улаанбаатар хот, Хан-Уул дүүрэг, 23 дугаар хороо, Арцатын
                    ам, Нийслэлийн нутгийн захиргааны төв цогцолбор байр, Б
                    блок, 7 дугаар давхар
                  </p>
                </div>
              </a>
              <a href="tel:%20+97675757807">
                <div className="flex items-center gap-2 mt-4 hover:text-blue-600 transition-colors">
                  <PhoneCall size={16} />
                  <p>+976 7575-7807</p>
                </div>
              </a>
              <a href="mailto:info@ub-procurement.mn">
                <div className="flex items-center gap-2 mt-4 hover:text-blue-600 transition-colors">
                  <Mail size={16} />
                  <p>info@ub-procurement.mn</p>
                </div>
              </a>
            </div>
          </div>
          <div>
            <Separator />
            <div className="flex gap-4 lg:flex-row flex-col justify-between uppercase mt-3">
              <p>
                Нийслэлийн Худалдан Авах ажиллагааны газар. © 2024 Бүх эрх
                хуулиар хамгаалагдсан
              </p>
              <p className="text-end">
                Вэб хөгжүүлсэн:
                <a
                  href="https://www.metadesk.mn/"
                  className="hover:text-blue-600 transition-colors ml-1"
                >
                  MetaData llc
                </a>
              </p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
