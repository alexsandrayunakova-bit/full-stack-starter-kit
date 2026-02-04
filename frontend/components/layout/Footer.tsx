"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100 border-t-2 border-blue-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI Tools Platform
            </h3>
            <p className="text-sm text-gray-600">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="text-gray-600 hover:text-primary-600 transition-colors">
                  {t("navbar.tools")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                  {t("navbar.dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-primary-600 transition-colors">
                  {t("navbar.profile")}
                </Link>
              </li>
            </ul>
          </div>

          {/* About Platform */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              {t("footer.aboutPlatform")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/about-platform" className="text-gray-600 hover:text-primary-600 transition-colors">
                  {t("footer.aboutPlatformLink")}
                </Link>
              </li>
              <li>
                <Link href="/future-projects" className="text-gray-600 hover:text-primary-600 transition-colors">
                  {t("footer.futureProjects")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:alex.sandra.yunakova@gmail.com" className="text-gray-600 hover:text-primary-600 transition-colors">
                  alex.sandra.yunakova@gmail.com
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/alexandra-yunakova/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/alexsandrayunakova-bit" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} AI Tools Platform. {t("footer.rights")}
            </p>
            <p className="text-sm text-gray-600">
              Created by Alexandra Yunakova & Claude &lt;3
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
