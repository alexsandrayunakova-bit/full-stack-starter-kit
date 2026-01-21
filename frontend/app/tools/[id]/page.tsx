"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";
import type { AiTool } from "@/lib/types";

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tool, setTool] = useState<AiTool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadTool();
    }
  }, [params.id]);

  const loadTool = async () => {
    setLoading(true);

    const response = await api.get<AiTool>(`/api/tools/${params.id}`);

    if (response.data) {
      setTool(response.data);
    } else {
      showToast("Инструментът не е намерен", "error");
      router.push("/tools");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Сигурни ли сте, че искате да изтриете този инструмент?")) {
      return;
    }

    const response = await api.delete(`/api/tools/${params.id}`);

    if (response.data || !response.error) {
      showToast("Инструментът е изтрит успешно", "success");
      router.push("/tools");
    } else {
      showToast(response.error || "Грешка при изтриване", "error");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!tool) {
    return null;
  }

  const canEdit = user && (user.id === tool.created_by || user.role?.name === "owner");

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-6">
              {tool.logo_url && (
                <div className="flex-shrink-0">
                  <img
                    src={tool.logo_url}
                    alt={tool.name}
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {tool.name}
                    </h1>
                    {tool.category && (
                      <Badge variant="primary" className="text-base">
                        {tool.category.name}
                      </Badge>
                    )}
                  </div>

                  {canEdit && (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/tools/${tool.id}/edit`)}
                      >
                        ✏️ Редактирай
                      </Button>
                      <Button variant="danger" size="sm" onClick={handleDelete}>
                        🗑️ Изтрий
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>👁️ {tool.views_count} прегледа</span>
                  {tool.average_rating && (
                    <span>⭐ {tool.average_rating.toFixed(1)} средна оценка</span>
                  )}
                  {tool.recommendations_count !== undefined && (
                    <span>💬 {tool.recommendations_count} отзива</span>
                  )}
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {tool.url && (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  🔗 Отвори инструмента
                </a>
              )}
              {tool.documentation_url && (
                <a
                  href={tool.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors"
                >
                  📚 Документация
                </a>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Тагове</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-3">
                {tool.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-4 py-2 rounded-full text-white font-medium"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* How to use */}
        {tool.how_to_use && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Как се използва
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {tool.how_to_use}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Examples */}
        {tool.examples && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Примери</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {tool.examples}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Creator Info */}
        {tool.creator && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Информация за създателя
              </h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {tool.creator.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {tool.creator.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.creator.role?.display_name || "Потребител"}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/tools"
            className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            ← Назад към инструментите
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
