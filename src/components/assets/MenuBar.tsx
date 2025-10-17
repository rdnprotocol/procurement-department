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
  // Green
  law: [
    {
      title: "Худалдан авах ажиллагааны талаар хууль тогтоомж",
      href: "https://www.tender.gov.mn/mn/document/list",
      children: [
        {
          title: "Хууль тогтоомж",
          href: "/category/huuli-togtoomj",
        },
        {
          title: "Жишиг баримт бичиг",
          href: "https://www.tender.gov.mn/mn/document/list",
        },
      ],
    },
    {
      title: "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж",
      href: "/category/baiguullagiin-huuli-togtoomj",
      children: [
        {
          title: "Хууль тогтоомж",
          description:
            "Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомжууд",
          href: "/category/baiguullagiin-huuli-togtoomj",
        },
        {
          title: "Газрын даргын тушаал",
          description: "Газрын даргын гаргасан тушаал, шийдвэрүүд",
          href: "/category/dargiin-tushaal",
        },
      ],
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
          title: "Бодлогын баримт бичиг, хууль тогтоомж",
          href: "/category/strateg-tolovlogoo-tailan",
        },
        {
          title: "Стратеги төлөвлөгөө",
          href: "/category/strateg-tolovlogoo",
        },
        {
          title: "Төлөвлөгөө, тайлан",
          href: "/category/tolovlogoo-tailan",
        },
        {
          title: "Худалдан авалтын статистик мэдээ",
          href: "/category/statistic",
        },
        {
          title: "Өргөдөл, гомдлын шийдвэрлэлт тайлан",
          href: "/activities/transparency/finance",
        },
        {
          title: "Иргэд хүлээн авах уулзалтын хуваарь",
          href: "/activities/transparency/finance",
        },
      ],
    },
    {
      title: "Хүний нөөц",
      href: "/activities/transparency/hr",
      children: [
        {
          title: "Төлөвлөгөө",
          href: "/activities/transparency/hr",
        },
        {
          title: "Тайлан",
          href: "/activities/transparency/hr",
        },
        {
          title: "Статистик мэдээ",
          href: "/activities/transparency/hr",
        },
      ],
    },
    {
      title: "Санхүүгийн ил тод байдал",
      href: "/https://shilendans.gov.mn/organization",
      children: [
        {
          title: "Шилэн данс",
          href: "/https://shilendans.gov.mn/organization/20081?ry=2025",
        },
      ],
    },
    {
      title: "Хяналт шалгалт",
      href: "/activities/monitoring",
      children: [
        {
          title: "Дотоод хяналт-шинжилгээ үнэлгээ",
          href: "/activities/monitoring/ethics",
        },
        {
          title: "Төрийн байгууллагын хяналт, дүгнэлт",
          href: "/activities/monitoring/ethics",
        },
        {
          title: "Захиалагчдад хийгдсэн хяналт, шалгалт, тайлан ",
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
          href: "https://ec.gov.mn/law",
        },
        {
          title: "Ажиллах Журам",
          href: "https://ec.gov.mn/shiidver",
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
  // Yellow
  tender: [
    {
      title: "Төлөвлөгөө, тайлан",
      href: "/category/tolovlogoo-tailan",
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
      href: "/",
      //news/id
    },
    {
      title: "Цахим дэлгүүр",
      href: "https://www.tender.gov.mn/mn/eshop",
    },
    {
      title: "Захиалагчдад зөвлөмж",
      href: "/",
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

  province: [
    {
      title: "Алтанбулаг",
      href: "/province/altanbulag",
      children: [
        { title: "Төлөвлөгөө", href: "/province/altanbulag/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/altanbulag/tender-result",
        },
      ],
    },
    {
      title: "Аргалант",
      href: "/province/argalant",
      children: [
        { title: "Төлөвлөгөө", href: "/province/argalant/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/argalant/tender-result",
        },
      ],
    },
    {
      title: "Архуст",
      href: "/province/arkhust",
      children: [
        { title: "Төлөвлөгөө", href: "/province/arkhust/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/arkhust/tender-result",
        },
      ],
    },
    {
      title: "Батсүмбэр",
      href: "/province/batsumber",
      children: [
        { title: "Төлөвлөгөө", href: "/province/batsumber/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/batsumber/tender-result",
        },
      ],
    },
    {
      title: "Баян",
      href: "/province/bayan",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bayan/plans" },
        { title: "Тендер шалгаруулалт", href: "/province/bayan/tender-result" },
      ],
    },
    {
      title: "Баяндэлгэр",
      href: "/province/bayandelger",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bayandelger/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/bayandelger/tender-result",
        },
      ],
    },
    {
      title: "Баянжаргалан",
      href: "/province/bayanjargalan",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bayanjargalan/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/bayanjargalan/tender-result",
        },
      ],
    },
    {
      title: "Баян-Өнжүүл",
      href: "/province/bayan-unjul",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bayan-unjul/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/bayan-unjul/tender-result",
        },
      ],
    },
    {
      title: "Баянхангай",
      href: "/province/bayankhangai",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bayankhangai/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/bayankhangai/tender-result",
        },
      ],
    },
    {
      title: "Баянцагаан",
      href: "/province/bayantsagaan",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bayantsagaan/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/bayantsagaan/tender-result",
        },
      ],
    },
    {
      title: "Баянцогт",
      href: "/province/bayantsogt",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bayantsogt/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/bayantsogt/tender-result",
        },
      ],
    },
    {
      title: "Баянчандмань",
      href: "/province/bayanchandmani",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bayanchandmani/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/bayanchandmani/tender-result",
        },
      ],
    },
    {
      title: "Борнуур",
      href: "/province/bornuur",
      children: [
        { title: "Төлөвлөгөө", href: "/province/bornuur/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/bornuur/tender-result",
        },
      ],
    },
    {
      title: "Бүрэн",
      href: "/province/buren",
      children: [
        { title: "Төлөвлөгөө", href: "/province/buren/plans" },
        { title: "Тендер шалгаруулалт", href: "/province/buren/tender-result" },
      ],
    },
    {
      title: "Дэлгэрхаан",
      href: "/province/delgerkhaan",
      children: [
        { title: "Төлөвлөгөө", href: "/province/delgerkhaan/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/delgerkhaan/tender-result",
        },
      ],
    },
    {
      title: "Жаргалант",
      href: "/province/jargalant",
      children: [
        { title: "Төлөвлөгөө", href: "/province/jargalant/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/jargalant/tender-result",
        },
      ],
    },
    {
      title: "Заамар",
      href: "/province/zaamar",
      children: [
        { title: "Төлөвлөгөө", href: "/province/zaamar/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/zaamar/tender-result",
        },
      ],
    },
    {
      title: "Зуунмод",
      href: "/province/zuunmod",
      children: [
        { title: "Төлөвлөгөө", href: "/province/zuunmod/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/zuunmod/tender-result",
        },
      ],
    },
    {
      title: "Лүн",
      href: "/province/lun",
      children: [
        { title: "Төлөвлөгөө", href: "/province/lun/plans" },
        { title: "Тендер шалгаруулалт", href: "/province/lun/tender-result" },
      ],
    },
    {
      title: "Мөнгөнморьт",
      href: "/province/mungunmorit",
      children: [
        { title: "Төлөвлөгөө", href: "/province/mungunmorit/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/mungunmorit/tender-result",
        },
      ],
    },
    {
      title: "Өндөрширээт",
      href: "/province/undurshireet",
      children: [
        { title: "Төлөвлөгөө", href: "/province/undurshireet/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/undurshireet/tender-result",
        },
      ],
    },
    {
      title: "Сүмбэр",
      href: "/province/sumber",
      children: [
        { title: "Төлөвлөгөө", href: "/province/sumber/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/sumber/tender-result",
        },
      ],
    },
    {
      title: "Сэргэлэн",
      href: "/province/sergelen",
      children: [
        { title: "Төлөвлөгөө", href: "/province/sergelen/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/sergelen/tender-result",
        },
      ],
    },
    {
      title: "Угтаалцайдам",
      href: "/province/ugtaaltsaidam",
      children: [
        { title: "Төлөвлөгөө", href: "/province/ugtaaltsaidam/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/ugtaaltsaidam/tender-result",
        },
      ],
    },
    {
      title: "Цээл",
      href: "/province/tseel",
      children: [
        { title: "Төлөвлөгөө", href: "/province/tseel/plans" },
        { title: "Тендер шалгаруулалт", href: "/province/tseel/tender-result" },
      ],
    },
    {
      title: "Эрдэнэ",
      href: "/province/erdene",
      children: [
        { title: "Төлөвлөгөө", href: "/province/erdene/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/erdene/tender-result",
        },
      ],
    },
    {
      title: "Эрдэнэсант",
      href: "/province/erdenesant",
      children: [
        { title: "Төлөвлөгөө", href: "/province/erdenesant/plans" },
        {
          title: "Тендер шалгаруулалт",
          href: "/province/erdenesant/tender-result",
        },
      ],
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
      <MenubarTrigger className="cursor-pointer font-normal uppercase text-xs">
        {title}
      </MenubarTrigger>
      <MenubarContent className="p-0 font-normal uppercase text-xs">
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
    className="block px-4 py-3 text-xs hover:bg-gray-100 border-b border-gray-200"
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
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className="block px-8 py-2 text-xs hover:bg-gray-100 border-b border-gray-100"
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
      <Menubar className="hidden lg:flex w-fit border-none shadow-none font-normal uppercase bg-transparent">
        <MenubarMenu>
          <div className="hover:bg-accent hover:text-accent-foreground  font-normal flex items-center rounded-sm px-2 py-1 text-xs outline-hidden select-none">
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

        <NestedMenuSection title="Сумд" categories={menuData.province} />

        <SimpleMenuSection
          title="Авилгын эсрэг"
          items={menuData.anticorruption}
        />

        <MenubarMenu>
          <div className="hover:bg-accent hover:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-xs font-normal outline-hidden select-none">
            <Link href="#contact">Холбоо барих</Link>
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
                href="#contact"
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
