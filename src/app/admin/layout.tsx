import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ удирдлага - ТӨВ",
  description: "Админ удирдлагын систем",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

