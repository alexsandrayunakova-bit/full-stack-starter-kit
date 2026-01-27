"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t-2 border-blue-200 dark:border-slate-700 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI Tools Platform
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("footer.description") || "Discover and share the best AI tools for your projects"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.tools")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("navbar.dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("navbar.profile")}
                </Link>
              </li>
            </ul>
          </div>

          {/* About Platform */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t("footer.aboutPlatform")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about-us" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/about-project" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.aboutProject")}
                </Link>
              </li>
              <li>
                <Link href="/future-projects" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.futureProjects")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t("footer.contacts")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} AI Tools Platform. {t("footer.rights") || "All rights reserved."}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("footer.madeBy") || "Made with"} ❤️ {t("footer.by") || "by"} Alexa Yunakova
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
