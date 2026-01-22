"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function SkipLink() {
  const { t } = useLanguage();

  return (
    <a href="#main-content" className="skip-to-main">
      {t("skipToMain")}
    </a>
  );
}
