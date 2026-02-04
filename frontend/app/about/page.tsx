"use client";

import SimpleNavbar from "@/components/layout/SimpleNavbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      <SimpleNavbar />
      <main className="container mx-auto px-4 py-24 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("page.aboutUs.title")}
            </h1>
            <p className="text-xl text-gray-600">
              {t("page.aboutUs.subtitle")}
            </p>
          </div>

          {/* Creator Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-lg">
                  A
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {t("page.aboutUs.creatorName")}
                </h2>
                <p className="text-lg text-primary-600 font-semibold mb-6">
                  {t("page.aboutUs.creatorRole")}
                </p>

                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>{t("page.aboutUs.bio1")}</p>
                  <p>{t("page.aboutUs.bio2")}</p>
                  <p>{t("page.aboutUs.bio3")}</p>
                  <p>{t("page.aboutUs.bio4")}</p>
                  <p>{t("page.aboutUs.bio5")}</p>
                </div>

                {/* Social Links */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                  <a
                    href="mailto:alex.sandra.yunakova@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <span>📧</span> Email
                  </a>
                  <a
                    href="https://www.linkedin.com/in/alexandra-yunakova/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    <span>💼</span> LinkedIn
                  </a>
                  <a
                    href="https://github.com/alexsandrayunakova-bit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
                  >
                    <span>🐙</span> GitHub
                  </a>
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
