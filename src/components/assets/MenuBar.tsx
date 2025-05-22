"use client";
import { useState } from "react";
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

  law: [
    {
      title: "Худалдан авах ажиллагааны талаар хууль тогтоомж",
      href: "/law/procurement",
      children: [
        {
          title: "Хууль тогтоомж",
          href: "/law/procurement/laws",
        },
        {
          title: "Жишиг баримт бичиг",
          href: "/law/procurement/templates",
        },
      ],
    },
    {
      title: "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж",
      href: "/law/organization",
      children: [
        {
          title: "Хууль тогтоомж",
          description:
            "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомжууд",
          href: "/law/organization/laws",
        },
        {
          title: "Газрын даргын тушаал",
          description: "Газрын даргын гаргасан тушаал, шийдвэрүүд",
          href: "/law/organization/orders",
        },
      ],
    },
  ],

  news: [
    {
      title: "Үйл явдлын мэдээ",
      href: "/news/events",
    },
    {
      title: "Видео мэдээ",
      href: "/news/videos",
    },
  ],

  activities: [
    {
      title: "Үйл ажиллагааны ил тод байдал",
      href: "/activities/transparency",
      children: [
        {
          title: "Стратеги төлөвлөгөө, тайлан",
          href: "/activities/transparency/hr",
        },
        {
          title: "Төлөвлөгөө, тайлан",
          href: "/activities/transparency/finance",
        },
        {
          title: "Бодлогын баримт бичиг, хууль тогтоомж",
          href: "/activities/transparency/finance",
        },
        {
          title: "Өргөдөл, гомдлын шийдвэрлэлт тайлан",
          href: "/activities/transparency/finance",
        },
        {
          title: "Статистик мэдээ",
          href: "/activities/transparency/finance",
        },
        {
          title: "Иргэд хүлээн авах уулзалтын хуваарь",
          href: "/activities/transparency/finance",
        },
      ],
    },
    {
      title: "Хүний нөөцийн ил тод байдал",
      href: "/activities/transparency/hr",
      children: [
        {
          title: "Хүний нөөцийн ил тод байдал",
          href: "/activities/transparency/hr",
        },
      ],
    },
    {
      title: "Санхүүгийн ил тод байдал",
      href: "/activities/transparency/finance",
      children: [
        {
          title: "Шилэн данс",
          href: "/activities/transparency/finance",
        },
      ],
    },
    {
      title: "Хяналт шалгалт, хянаалт-шинжилгээ, үнэлгээ",
      href: "/activities/monitoring",
      children: [
        {
          title: "Хяналт, Шалгалтын тайлан, Дүгнэлт",
          href: "/activities/monitoring/ethics",
        },
        {
          title: "Хяналт-шинжилгээ үнэлгээ",
          href: "/activities/monitoring/ethics",
        },
      ],
    },
    {
      title: "Эс зүйн дэд хороо",
      href: "/activities/monitoring/ethics",
      children: [
        {
          title: "Хууль, Журам",
          href: "/activities/monitoring/ethics",
        },
        {
          title: "Ажиллах Журам",
          href: "/activities/monitoring/ethics",
        },
        {
          title: "Үйл ажиллагаа",
          href: "/activities/monitoring/ethics",
        },
        {
          title: "Бүрэлдэхүүн",
          href: "/activities/monitoring/ethics",
        },
      ],
    },
  ],

  tender: [
    {
      title: "Төлөвлөгөө, тайлан",
      href: "/tender/plans",
    },
    {
      title: "Тендерийн урилга",
      href: "/tender/invitation",
    },
    {
      title: "Тендер шалгаруулалтын үр дүн",
      href: "/tender/results",
    },
    {
      title: "Иргэн, аж ахуй эрхлэгч жагсаалт",
      href: "/tender/list-of-suppliers",
    },
    {
      title: "Засгийн газрын тогтоол",
      href: "/tender/government-decrees",
    },
    {
      title: "Хөндлөнгийн гишүүний жагсаалт",
      href: "/tender/independent-members",
    },
    {
      title: "Цахим дэлгүүр",
      href: "/tender/estore",
    },
    {
      title: "Жишиг техникийн тодорхойлолт",
      href: "/tender/specifications",
    },
    {
      title: "Төлбөр төлөх дансны мэдээлэл",
      href: "/tender/payment-info",
    },
  ],

  anticorruption: [
    {
      title: "Төлөвлөгөө, тайлан",
      href: "/anticorruption/plans",
    },
    {
      title: "Хасум хянасан дүгнэлт",
      href: "/anticorruption/reviews",
    },
    {
      title: "Соён гэгээрүүлэх үйл ажиллагаа",
      href: "/anticorruption/education",
    },
  ],
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
      <MenubarTrigger className="cursor-pointer">{title}</MenubarTrigger>
      <MenubarContent className="p-0">
        {items.map((item, index) => (
          <MenubarItem key={index}>
            <Link href={item.href}>{item.title}</Link>
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
      <MenubarTrigger className="cursor-pointer">{title}</MenubarTrigger>
      <MenubarContent className="p-0">
        {categories.map((category, index) => (
          <MenubarSub key={index}>
            <MenubarSubTrigger className="cursor-pointer">
              {category.title}
            </MenubarSubTrigger>
            <MenubarSubContent className="p-0">
              {category.children.map((item, itemIndex) => (
                <MenubarItem key={itemIndex}>
                  <Link href={item.href}>{item.title}</Link>
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
}) => (
  <Link
    href={item.href}
    className="block px-4 py-3 text-sm hover:bg-gray-100 border-b border-gray-200"
    onClick={onClose}
  >
    {item.title}
  </Link>
);

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
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && (
        <div className="bg-gray-50">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <button
                className="w-full px-6 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-100"
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
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className="block px-8 py-2 text-sm hover:bg-gray-100 border-b border-gray-100"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
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
      <Menubar className="hidden lg:flex w-fit border-none shadow-none">
        <MenubarMenu>
          <div className="hover:bg-accent hover:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none">
            <Link href="/">Нүүр хуудас</Link>
          </div>
        </MenubarMenu>

        <SimpleMenuSection title="Бидний тухай" items={menuData.about} />

        <NestedMenuSection title="Хууль, Эрх зүй" categories={menuData.law} />

        <SimpleMenuSection title="Мэдээ, мэдээлэл" items={menuData.news} />

        <NestedMenuSection
          title="Ил тод байдал"
          categories={menuData.activities}
        />

        <SimpleMenuSection title="Тендер" items={menuData.tender} />

        <SimpleMenuSection
          title="Авилгын эсрэг"
          items={menuData.anticorruption}
        />

        <MenubarMenu>
          <div className="hover:bg-accent hover:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none">
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
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
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
                className="block px-4 py-3 text-sm font-medium hover:bg-gray-100 border-b border-gray-200"
                onClick={closeMobileMenu}
              >
                Нүүр хуудас
              </Link>

              <MobileMenuSection
                title="Бидний тухай"
                items={menuData.about}
                onClose={closeMobileMenu}
              />

              <MobileNestedMenuSection
                title="Хууль, Эрх зүй"
                categories={menuData.law}
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

              <MobileMenuSection
                title="Авилгын эсрэг"
                items={menuData.anticorruption}
                onClose={closeMobileMenu}
              />

              <Link
                href="/contact"
                className="block px-4 py-3 text-sm font-medium hover:bg-gray-100 border-b border-gray-200"
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
