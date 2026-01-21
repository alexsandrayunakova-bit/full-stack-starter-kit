import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Tools Platform - Управление на AI инструменти",
  description: "Платформа за управление и каталогизиране на AI инструменти с филтриране по категории, роли и тагове.",
  keywords: ["AI", "tools", "платформа", "инструменти", "управление"],
  authors: [{ name: "AI Tools Platform Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={inter.variable}>
      <body className="antialiased">
        <Providers>
          <a href="#main-content" className="skip-to-main">
            Към основното съдържание
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
