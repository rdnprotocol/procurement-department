import { Container } from "./assets";
import { Earth, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { VisitorStats } from "./VisitorStats";

export const Footer = () => {
  const quickLinks = [
    { name: "Шилэн данс", href: "https://shilendans.gov.mn", icon: Earth },
    { name: "Шил ажиллагаа", href: "https://ub-procurement.mn/about-uss/", icon: ExternalLink },
  ];

  const socialLinks = [
    { icon: FaYoutube, href: "#", label: "YouTube", hoverColor: "hover:bg-red-600" },
    { icon: FaTwitter, href: "#", label: "Twitter", hoverColor: "hover:bg-sky-500" },
    { icon: FaFacebook, href: "#", label: "Facebook", hoverColor: "hover:bg-blue-600" },
  ];

  return (
    <footer className="relative bg-[#24276B] text-white overflow-hidden">
      {/* Background Pattern - tumen-nasan.png */}
      <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:10%_auto] opacity-20 pointer-events-none" />

      {/* Main Content */}
      <div className="relative">
        <Container>
          <div className="py-12 lg:py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">
              
              {/* Logo Section - 3 columns */}
              <div className="lg:col-span-3">
                <div className="flex flex-col items-center lg:items-start">
                  {/* Logo */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl scale-150" />
                    <Image
                      src="/logo-tov.jpeg"
                      width={72}
                      height={72}
                      alt="Төв аймгийн ХААГ лого"
                      className="relative rounded-full ring-2 ring-white/20 shadow-xl"
                    />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-base font-bold text-center lg:text-left leading-tight mb-5">
                    <span className="text-yellow-400">Төв аймгийн</span>
                    <br />
                    Худалдан авах ажиллагааны газар
                  </h2>

                  {/* Social Links */}
                  <div className="flex gap-2">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        className={`p-2 bg-white/10 rounded-lg transition-all duration-300 ${social.hoverColor} hover:scale-110 hover:shadow-lg`}
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links - 2 columns */}
              <div className="lg:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-yellow-400 rounded-full" />
                  Холбоосууд
                </h3>
                <ul className="space-y-2.5">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                      >
                        <span className="p-1 bg-white/5 rounded group-hover:bg-white/10 transition-colors">
                          <link.icon className="w-3 h-3" />
                        </span>
                        <span className="text-xs">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info - 4 columns */}
              <div className="lg:col-span-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-yellow-400 rounded-full" />
                  Холбоо барих
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://maps.app.goo.gl/9BbHsXsCJ1e4ehv3A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 text-white/70 hover:text-white transition-colors"
                    >
                      <span className="p-1 bg-white/5 rounded group-hover:bg-white/10 transition-colors mt-0.5">
                        <MapPin className="w-3 h-3" />
                      </span>
                      <span className="text-xs leading-relaxed">
                        Төв аймаг, Зуунмод сум, 6-р баг
                        <br />
                        <span className="text-white/50">Төр захиргааны 2-р байр</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+97677553579"
                      className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                      <span className="p-1 bg-white/5 rounded group-hover:bg-green-500/20 transition-colors">
                        <Phone className="w-3 h-3" />
                      </span>
                      <span className="text-xs">+976 7755-3579</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:tuvprocurement@tov.gov.mn"
                      className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                      <span className="p-1 bg-white/5 rounded group-hover:bg-blue-500/20 transition-colors">
                        <Mail className="w-3 h-3" />
                      </span>
                      <span className="text-xs">tuvprocurement@tov.gov.mn</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Visitor Stats - 3 columns */}
              <div className="lg:col-span-3 flex justify-center lg:justify-end">
                <VisitorStats />
              </div>
            </div>
          </div>
        </Container>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20">
          <Container>
            <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
              <p className="text-center sm:text-left">
                © 2025 <span className="text-white/70">Төв аймгийн ХААГ</span> — Бүх эрх хуулиар хамгаалагдсан
              </p>
              <p className="flex items-center gap-1.5">
                Хөгжүүлсэн:
                <a
                  href="https://www.metadesk.mn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400/80 hover:text-yellow-400 transition-colors font-medium"
                >
                  MetaData LLC
                </a>
              </p>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
};
