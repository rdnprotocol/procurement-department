"use client";
import { useState } from "react";
import { PROVINCES } from "@/utils/provinces";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

const menuData = {
  about: [
    {
      title: "Эрхэм зорилго, үйл ажиллагааны стратегийн зорилго, зорилт",
      href: "/about/mission",
    },
    {
      title: "Бүтэц, зохион байгуулалт",
      href: "/about/structure",
    },
    {
      title: "Байгууллагын танилцуулга",
      href: "/about/intro",
    },
    {
      title: "Түүхэн замнал",
      href: "/about/history",
    },
  ],
  // Green - Simple menu without children
  law: [
    {
      title: "Худалдан авах ажиллагааны талаар хууль тогтоомж",
      href: "/law/procurement",
    },
    {
      title: "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж",
      href: "/law/organization",
    },
  ],
  // Green
  news: [
    {
      title: "Үйл явдлын мэдээ",
      href: "/category/uil-yvdliin-medee",
    },
    {
      title: "Видео мэдээ",
      href: "/category/video-medee",
    },
  ],

  activities: [
    {
      title: "Үйл ажиллагааны ил тод байдал",
      href: "/activities/transparency",
      children: [
        {
          title: "Бодлогын баримт бичиг",
          href: "/activities/transparency/policy",
        },
        {
          title: "Стратеги төлөвлөгөө",
          href: "/activities/transparency/strategy",
        },
        {
          title: "Төлөвлөгөө, тайлан",
          href: "/activities/transparency/plan",
        },
        {
          title: "Статистик мэдээ",
          href: "/activities/transparency/statistics",
        },
        {
          title: "Өргөдөл, гомдлын шийдвэрлэлт",
          href: "/activities/transparency/complaints",
        },
        {
          title: "Иргэд хүлээн авах уулзалт",
          href: "/activities/transparency/meetings",
        },
      ],
    },
    {
      title: "Хүний нөөц",
      href: "/activities/transparency/hr",
      children: [
        {
          title: "Танилцуулга",
          href: "/activities/transparency/hr#intro",
        },
        {
          title: "Төлөвлөгөө",
          href: "/activities/transparency/hr#plan",
        },
        {
          title: "Тайлан",
          href: "/activities/transparency/hr#report",
        },
        {
          title: "Статистик мэдээ",
          href: "/activities/transparency/hr#stats",
        },
      ],
    },
    {
      title: "Санхүүгийн ил тод байдал",
      href: "https://shilendans.gov.mn/organization/20081?ry=2025",
      children: [
        {
          title: "Шилэн данс",
          href: "https://shilendans.gov.mn/organization/20081?ry=2025",
        },
      ],
    },
    {
      title: "Хяналт шалгалт",
      href: "/activities/monitoring",
      children: [
        {
          title: "Танилцуулга",
          href: "/activities/monitoring#intro",
        },
        {
          title: "Дотоод хяналт",
          href: "/activities/monitoring#internal",
        },
        {
          title: "Төрийн хяналт",
          href: "/activities/monitoring#government",
        },
        {
          title: "Захиалагчийн хяналт",
          href: "/activities/monitoring#client",
        },
      ],
    },
    {
      title: "Ёс зүйн дэд хороо",
      href: "/activities/ethics",
      children: [
        {
          title: "Танилцуулга",
          href: "/activities/ethics#intro",
        },
        {
          title: "Үйл ажиллагаа",
          href: "/activities/ethics#activity",
        },
        {
          title: "Бүрэлдэхүүн",
          href: "/activities/ethics#members",
        },
      ],
    },
  ],
  // Yellow
  tender: [
    {
      title: "Төлөвлөгөө, тайлан",
      href: "/activities/tender/plan",
    },
    {
      title: "Тендерийн урилга",
      href: "https://www.tender.gov.mn/mn/invitation",
    },
    {
      title: "Тендер шалгаруулалтын үр дүн",
      href: "https://user.tender.gov.mn/mn/result/",
    },
    {
      title: "А3 гэрчилгээтэй хүний нөөц",
      href: "/activities/tender/a3",
    },
    {
      title: "Цахим дэлгүүр",
      href: "https://www.tender.gov.mn/mn/eshop",
    },
    {
      title: "Захиалагчдад зөвлөмж",
      href: "/activities/tender/zovlomj",
    },
  ],
  // Green
  anticorruption: [
    {
      title: "Төлөвлөгөө, тайлан",
      href: "/category/at-tolovlogoo-tailan",
    },
    {
      title: "Хасум хянасан дүгнэлт",
      href: "/category/hasum-report",
    },
    {
      title: "Соён гэгээрүүлэх үйл ажиллагаа",
      href: "https://iaac.mn/19/video",
    },
  ],

  province: PROVINCES.map((p) => ({
    title: p.title,
    href: `/province/${p.slug}`,
    children: [
      { title: "Төлөвлөгөө", href: `/province/${p.slug}#plans` },
      { title: "Тендер шалгаруулалт", href: `/province/${p.slug}#tender-result` },
    ],
  })),
};

interface MenuItem {
  title: string;
  href: string;
}

interface MenuCategory {
  title: string;
  href: string;
  children: MenuItem[];
}

// Helper function to check if URL is external
const isExternalLink = (href: string) => {
  return href.startsWith('http://') || href.startsWith('https://');
};

// Desktop Menu Components
const SimpleMenuSection = ({
  title,
  items,
}: {
  title: string;
  items: MenuItem[];
}) => {
  return (
    <MenubarMenu>
      <MenubarTrigger className="cursor-pointer font-normal uppercase text-xs">
        {title}
      </MenubarTrigger>
      <MenubarContent className="p-0 font-normal uppercase text-xs">
        {items.map((item, index) => (
          <MenubarItem key={index}>
            {isExternalLink(item.href) ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                {item.title}
              </a>
            ) : (
              <Link href={item.href}>{item.title}</Link>
            )}
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
};

const NestedMenuSection = ({
  title,
  categories,
}: {
  title: string;
  categories: MenuCategory[];
}) => {
  return (
    <MenubarMenu>
      <MenubarTrigger className="cursor-pointer font-normal uppercase text-xs">
        {title}
      </MenubarTrigger>
      <MenubarContent className="p-0 font-normal uppercase text-xs">
        {categories.map((category, index) => (
          <MenubarSub key={index}>
            <MenubarSubTrigger className="cursor-pointer">
              {category.title}
            </MenubarSubTrigger>
            <MenubarSubContent className="p-0">
              {category.children.map((item, itemIndex) => (
                <MenubarItem key={itemIndex}>
                  {isExternalLink(item.href) ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      {item.title}
                    </a>
                  ) : (
                    <Link href={item.href}>{item.title}</Link>
                  )}
                </MenubarItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
};

// Mobile Menu Components
const MobileMenuItem = ({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) => {
  if (isExternalLink(item.href)) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-200"
        onClick={onClose}
      >
        {item.title}
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-200"
      onClick={onClose}
    >
      {item.title}
    </Link>
  );
};

const MobileMenuSection = ({
  title,
  items,
  onClose,
}: {
  title: string;
  items: MenuItem[];
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && (
        <div className="bg-gray-50">
          {items.map((item, index) => (
            <MobileMenuItem key={index} item={item} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
};

const MobileNestedMenuSection = ({
  title,
  categories,
  onClose,
}: {
  title: string;
  categories: MenuCategory[];
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<number[]>([]);

  const toggleSubmenu = (index: number) => {
    setOpenSubmenus((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-normal">{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && (
        <div className="bg-gray-50">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <button
                className="w-full px-6 py-2 text-left text-xs flex items-center justify-between hover:bg-gray-100"
                onClick={() => toggleSubmenu(categoryIndex)}
              >
                <span>{category.title}</span>
                {openSubmenus.includes(categoryIndex) ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
              {openSubmenus.includes(categoryIndex) && (
                <div className="bg-white">
                  {category.children.map((item, itemIndex) => (
                    isExternalLink(item.href) ? (
                      <a
                        key={itemIndex}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-8 py-2 text-xs hover:bg-gray-100 border-b border-gray-100"
                        onClick={onClose}
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className="block px-8 py-2 text-xs hover:bg-gray-100 border-b border-gray-100"
                        onClick={onClose}
                      >
                        {item.title}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main MenuBar Component
export const MenuBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <Menubar className="hidden lg:flex w-fit border-none shadow-none font-normal uppercase bg-transparent">
        <MenubarMenu>
          <div className="hover:bg-accent hover:text-accent-foreground  font-normal flex items-center rounded-sm px-2 py-1 text-xs outline-hidden select-none">
            <Link href="/">Нүүр хуудас</Link>
          </div>
        </MenubarMenu>

        <SimpleMenuSection title="Бидний тухай" items={menuData.about} />

        <SimpleMenuSection title="Хууль, Эрх зүй" items={menuData.law} />

        <SimpleMenuSection title="Мэдээ, мэдээлэл" items={menuData.news} />

        <NestedMenuSection
          title="Ил тод байдал"
          categories={menuData.activities}
        />

        <SimpleMenuSection title="Тендер" items={menuData.tender} />

        <NestedMenuSection title="Сумд" categories={menuData.province} />

        <SimpleMenuSection
          title="Авилгын эсрэг"
          items={menuData.anticorruption}
        />

        <MenubarMenu>
          <div className="hover:bg-accent hover:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-xs font-normal outline-hidden select-none">
            <Link href="/contact">Холбоо барих</Link>
          </div>
        </MenubarMenu>
      </Menubar>

      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 uppercase">
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Цэс</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto h-full pb-20">
              <Link
                href="/"
                className="block px-4 py-3 text-xs font-normal hover:bg-gray-100 border-b border-gray-200"
                onClick={closeMobileMenu}
              >
                Нүүр хуудас
              </Link>

              <MobileMenuSection
                title="Бидний тухай"
                items={menuData.about}
                onClose={closeMobileMenu}
              />

              <MobileMenuSection
                title="Хууль, Эрх зүй"
                items={menuData.law}
                onClose={closeMobileMenu}
              />

              <MobileMenuSection
                title="Мэдээ, мэдээлэл"
                items={menuData.news}
                onClose={closeMobileMenu}
              />

              <MobileNestedMenuSection
                title="Ил тод байдал"
                categories={menuData.activities}
                onClose={closeMobileMenu}
              />

              <MobileMenuSection
                title="Тендер"
                items={menuData.tender}
                onClose={closeMobileMenu}
              />

              <MobileNestedMenuSection
                title="Сумд"
                categories={menuData.province}
                onClose={closeMobileMenu}
              />

              <MobileMenuSection
                title="Авилгын эсрэг"
                items={menuData.anticorruption}
                onClose={closeMobileMenu}
              />

              <Link
                href="/contact"
                className="block px-4 py-3 text-xs font-normal hover:bg-gray-100 border-b border-gray-200"
                onClick={closeMobileMenu}
              >
                Холбоо барих
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { menuData };
