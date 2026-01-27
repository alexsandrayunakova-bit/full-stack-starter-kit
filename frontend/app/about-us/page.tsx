"use client";

import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
              {t("aboutUs.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t("aboutUs.subtitle")}
            </p>
          </CardHeader>
          <CardBody>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t("aboutUs.name")}
              </h2>

              <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  {t("aboutUs.bio1")}
                </p>

                <p className="leading-relaxed">
                  {t("aboutUs.bio2")}
                </p>

                <p className="leading-relaxed">
                  {t("aboutUs.bio3")}
                </p>

                <p className="leading-relaxed">
                  {t("aboutUs.bio4")}
                </p>

                <p className="leading-relaxed">
                  {t("aboutUs.bio5")}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
