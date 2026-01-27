"use client";

import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t("contact.subtitle")}
            </p>
          </CardHeader>
          <CardBody>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-center py-12">
                <div className="text-8xl mb-8">📧</div>

                <div className="space-y-6">
                  <div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                      {t("contact.email")}
                    </p>
                    <a
                      href="mailto:contact@aitools.com"
                      className="text-2xl font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      {t("contact.emailAddress")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
