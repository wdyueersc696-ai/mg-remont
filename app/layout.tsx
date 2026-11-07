import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mg-remont-moscow.wdyueersc696.chatgpt.site"),
  title: "MG Remont",
  description: "Максим Гуревич. Ремонт квартир и загородных домов под ключ в Москве и Московской области. Реальные проекты, обзоры интерьеров и связь в Telegram.",
  openGraph: { title: "MG Remont", siteName: "MG Remont", description: "Ремонт квартир и загородных домов под ключ. Максим Гуревич · Москва и область.", locale: "ru_RU", type: "website", images: [{ url: "/media/house.jpg" }] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
