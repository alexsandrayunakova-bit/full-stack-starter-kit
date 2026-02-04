"use client";

import SimpleNavbar from "@/components/layout/SimpleNavbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPlatformPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      <SimpleNavbar />
      <main className="container mx-auto px-4 py-24 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("page.aboutPlatform.title")}
            </h1>
            <p className="text-xl text-gray-600">
              {t("page.aboutPlatform.subtitle")}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-5xl shadow-lg">
                🤖
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {t("page.aboutPlatform.content")}
              </p>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("language") === "bg" ? "Лесно търсене" : t("language") === "de" ? "Einfache Suche" : "Easy Search"}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("language") === "bg" ? "Намерете точно това, което ви трябва" : t("language") === "de" ? "Finden Sie genau das, was Sie brauchen" : "Find exactly what you need"}
                </p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("language") === "bg" ? "Рейтинги" : t("language") === "de" ? "Bewertungen" : "Ratings"}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("language") === "bg" ? "Реални оценки от потребители" : t("language") === "de" ? "Echte Nutzerbewertungen" : "Real user reviews"}
                </p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-4xl mb-4">🏷️</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("language") === "bg" ? "Категории" : t("language") === "de" ? "Kategorien" : "Categories"}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("language") === "bg" ? "Организирани по професии и нужди" : t("language") === "de" ? "Organisiert nach Berufen und Bedürfnissen" : "Organized by profession and needs"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
