"use client";

import { 
  MessageCircleQuestion, 
  Headphones, 
  MapPin, 
  Globe, 
  Send
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function QuickLinksSidebar() {
  const quickLinks = [
    {
      icon: Headphones,
      label: "Холбоо барих",
      href: "/contact",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: MapPin,
      label: "Байршил",
      href: "/contact",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Globe,
      label: "Вэб сайт",
      href: "#",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Send,
      label: "Санал хүсэлт",
      href: "#feedback",
      color: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col items-end">
        {/* Logo Section - Blue Background */}
        <Link
          href="/"
          className="mb-1 h-14 w-14 bg-blue-600 hover:bg-blue-700 rounded-l-lg flex items-center transition-all duration-300 shadow-lg overflow-hidden group"
          onMouseEnter={(e) => {
            e.currentTarget.style.width = 'auto';
            e.currentTarget.style.paddingRight = '1rem';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = '3.5rem';
            e.currentTarget.style.paddingRight = '0';
          }}
        >
          <div className="w-14 flex-shrink-0 flex items-center justify-center">
            <Image
              src="/logo-tov.jpeg"
              width={40}
              height={40}
              alt="Logo"
              className="rounded-full"
            />
          </div>
          <span className="text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Нүүр хуудас
          </span>
        </Link>

        {/* FAQ Button - Yellow */}
        <Link
          href="#faq"
          className="mb-1 h-14 w-14 bg-yellow-400 hover:bg-yellow-500 rounded-l-lg flex items-center transition-all duration-300 shadow-lg overflow-hidden group"
          onMouseEnter={(e) => {
            e.currentTarget.style.width = 'auto';
            e.currentTarget.style.paddingRight = '1rem';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = '3.5rem';
            e.currentTarget.style.paddingRight = '0';
          }}
        >
          <div className="w-14 flex-shrink-0 flex items-center justify-center">
            <MessageCircleQuestion className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Асуулт, хариулт
          </span>
        </Link>

        {/* Quick Links - Blue buttons */}
        <div className="flex flex-col items-end space-y-1">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={index}
                href={link.href}
                className={`h-14 w-14 ${link.color} rounded-l-lg flex items-center transition-all duration-300 shadow-lg overflow-hidden group`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.width = 'auto';
                  e.currentTarget.style.paddingRight = '1rem';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.width = '3.5rem';
                  e.currentTarget.style.paddingRight = '0';
                }}
              >
                <div className="w-14 flex-shrink-0 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

