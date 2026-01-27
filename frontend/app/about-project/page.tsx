"use client";

import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutProject() {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
              {t("aboutProject.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t("aboutProject.subtitle")}
            </p>
          </CardHeader>
          <CardBody>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <p className="text-lg leading-relaxed">
                  {t("aboutProject.content1")}
                </p>

                <p className="text-lg leading-relaxed">
                  {t("aboutProject.content2")}
                </p>

                <p className="text-lg leading-relaxed">
                  {t("aboutProject.content3")}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
