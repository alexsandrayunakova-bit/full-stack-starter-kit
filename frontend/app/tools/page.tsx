"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Loading from "@/components/ui/Loading";
import api from "@/lib/api";
import type { AiTool, Category, Tag } from "@/lib/types";

export default function ToolsPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [toolsRes, categoriesRes, tagsRes] = await Promise.all([
      api.get<{ data: AiTool[] }>("/api/tools"),
      api.get<{ data: Category[] }>("/api/categories"),
      api.get<{ data: Tag[] }>("/api/tags"),
    ]);

    if (toolsRes.data && toolsRes.data.data) {
      setTools(toolsRes.data.data);
    }

    if (categoriesRes.data && categoriesRes.data.data) {
      setCategories(categoriesRes.data.data);
    }

    if (tagsRes.data && tagsRes.data.data) {
      setTags(tagsRes.data.data);
    }

    setLoading(false);
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      searchTerm === "" ||
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "" || tool.category_id.toString() === selectedCategory;

    const matchesTag =
      selectedTag === "" ||
      (tool.tags && tool.tags.some((tag) => tag.id.toString() === selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              AI Инструменти 🛠️
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Открийте перфектните инструменти за вашите нужди
            </p>
          </div>

          <Link
            href="/tools/new"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-center"
          >
            ➕ Добави инструмент
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="search"
                placeholder="Търси по име или описание..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Всички категории</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Всички тагове</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedCategory || selectedTag) && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 dark:text-gray-400">Активни филтри:</span>
                {searchTerm && (
                  <Badge variant="primary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                    Търсене: {searchTerm} ✕
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("")}>
                    Категория ✕
                  </Badge>
                )}
                {selectedTag && (
                  <Badge variant="success" className="cursor-pointer" onClick={() => setSelectedTag("")}>
                    Таг ✕
                  </Badge>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tools Grid */}
        {loading ? (
          <Loading />
        ) : filteredTools.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Няма намерени инструменти
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Опитайте различни филтри или добавете нов инструмент
              </p>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-gray-600 dark:text-gray-400">
              Намерени {filteredTools.length} {filteredTools.length === 1 ? "инструмент" : "инструмента"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} hover>
                  <CardBody className="h-full flex flex-col">
                    {tool.logo_url && (
                      <div className="mb-4 h-16 flex items-center justify-center">
                        <img
                          src={tool.logo_url}
                          alt={tool.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}

                    <Link href={`/tools/${tool.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {tool.name}
                      </h3>
                    </Link>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                      {tool.description}
                    </p>

                    {tool.category && (
                      <Badge variant="primary" className="mb-3 inline-block">
                        {tool.category.name}
                      </Badge>
                    )}

                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tool.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                        {tool.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            +{tool.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700 mb-4">
                      <span>👁️ {tool.views_count} прегледа</span>
                      {tool.average_rating && (
                        <span>⭐ {tool.average_rating.toFixed(1)}</span>
                      )}
                    </div>

                    {/* Visit Website Button */}
                    {tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg text-center transform hover:scale-105"
                      >
                        🔗 Посети сайта
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 font-semibold rounded-lg cursor-not-allowed text-center"
                      >
                        🔗 Няма линк
                      </button>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
