"use client";
import { Container } from "./assets";
import { Separator } from "./ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const NavBar = () => {
  const Apps = [
    {
      title: "📜 Монгол бичиг",
      description: "Монгол бичиг хөрвүүлэгч",
      href: "/programms/script",
    },
    {
      title: "📹 Youtube Downloader",
      description: "Youtube-ээс хүссэн дүрс бичлэгээ татах",
      href: "/programms/ytdl",
    },
    {
      title: "📄 PDF Master",
      description: "PDF Хөрвүүрэгч",
      href: "/",
    },
    {
      title: "📧 И-мэйл",
      description: "Connect with other tools",
      href: "/",
    },
    {
      title: "💾 Санах ой",
      description: "Өөрийн файлуудаа хадгалах",
      href: "/",
    },
    {
      title: "🛠️ Бусад",
      description: "Нэмэлт хөгжүүлэлт",
      href: "/",
    },
  ];
  const Customers = [
    {
      title: "Үйлчилгээ ✨",
      description: "Захиалгат үйлчилгээ авах",
      href: "/service",
    },
    {
      title: "Хүсэлтийн систем 📋",
      description: "Хүсэлт үүсгэх хүсэлтийн жагсаалт харах",
      href: "/customer/tasks",
    },
    {
      title: "Холбоосууд 🔗",
      description: "Хэрэгтэй холбоос",
      href: "/customer/url",
    },
    {
      title: "Мэдлэгийн сан 📚",
      description: "Байгууллагын мэдлэгийн сан",
      href: "/customer/knowledgebase",
    },
    {
      title: "📂 Файлын сан",
      description: "Хэрэгтэй файлуудын сан",
      href: "/",
    },
    {
      title: "💻 Мэдээлэл технологи",
      description: "Байгууллагад ашиглаж буй систем, тоног төхөөрөмжүүд",
      href: "/",
    },
  ];
  return (
    <div className="border-b-2 border-blue-800">
      <Container>
        <div>Search</div>
        <Separator />
        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Харилцагч</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Харилцагч</NavigationMenuTrigger>
                  <NavigationMenuContent>f</NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Программ</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-3">
                  {Apps.map((app, index) => (
                    <NavigationMenuLink
                      href={app.href}
                      key={index}
                      className="rounded-md p-3 transition-colors hover:bg-muted/70"
                    >
                      <div key={app.title}>
                        <p className="mb-1 font-semibold">{app.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.description}
                        </p>
                      </div>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/shop"
                className={navigationMenuTriggerStyle()}
              >
                Дэлгүүр
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Харилцагч</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-3">
                  {Customers.map((Customer, index) => (
                    <NavigationMenuLink
                      href={Customer.href}
                      key={index}
                      className="rounded-md p-3 transition-colors hover:bg-muted/70"
                    >
                      <div key={Customer.title}>
                        <p className="mb-1 font-semibold">{Customer.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {Customer.description}
                        </p>
                      </div>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Container>
    </div>
  );
};
