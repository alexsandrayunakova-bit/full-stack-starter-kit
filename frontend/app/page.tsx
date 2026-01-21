"use client";

import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <main className="container mx-auto px-4 py-16 text-center flex-1 flex flex-col items-center justify-center">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-12 bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent">
          {t("home.title")}
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/tools"
            className="px-10 py-5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
          >
            {t("home.tools")}
          </Link>

          <Link
            href="/login"
            className="px-10 py-5 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
          >
            {t("home.login")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
