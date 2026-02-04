"use client";

import SimpleNavbar from "@/components/layout/SimpleNavbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FutureProjectsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      <SimpleNavbar />
      <main className="container mx-auto px-4 py-24 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("page.futureProjects.title")}
            </h1>
            <p className="text-xl text-gray-600">
              {t("page.futureProjects.subtitle")}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <p className="text-lg text-gray-700 text-center mb-10">
              {t("page.futureProjects.intro")}
            </p>

            {/* Roadmap Items */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {t("page.futureProjects.item1")}
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                  🔗
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {t("page.futureProjects.item2")}
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                  📱
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {t("page.futureProjects.item3")}
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                  ⚖️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {t("page.futureProjects.item4")}
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl">
                  👥
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {t("page.futureProjects.item5")}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
