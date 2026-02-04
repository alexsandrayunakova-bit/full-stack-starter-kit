"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";
import type { AiTool, Category, Tag, Role } from "@/lib/types";

interface ToolShowResponse {
  tool: AiTool;
  average_rating: number | null;
  recommendations_count: number;
}

export default function EditToolPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    documentation_url: "",
    description: "",
    how_to_use: "",
    examples: "",
    logo_url: "",
    category_id: "",
    tag_ids: [] as number[],
    role_ids: [] as number[],
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      loadData();
    }
  }, [isAuthenticated, params.id]);

  const loadData = async () => {
    const [toolRes, categoriesRes, tagsRes, rolesRes] = await Promise.all([
      api.get<ToolShowResponse>(`/api/tools/${params.id}`),
      api.get<{ data: Category[] }>("/api/categories"),
      api.get<{ data: Tag[] }>("/api/tags"),
      api.get<{ data: Role[] }>("/api/roles"),
    ]);

    if (categoriesRes.data?.data) {
      setCategories(categoriesRes.data.data);
    }
    if (tagsRes.data?.data) {
      setTags(tagsRes.data.data);
    }
    if (rolesRes.data?.data) {
      setRoles(rolesRes.data.data);
    }

    if (toolRes.data) {
      const tool = toolRes.data.tool || toolRes.data;

      // Check permission
      if (user && tool.created_by !== user.id && user.role?.name !== "owner") {
        showToast("Нямате права да редактирате този инструмент", "error");
        router.push(`/tools/${params.id}`);
        return;
      }

      setFormData({
        name: tool.name || "",
        url: tool.url || "",
        documentation_url: tool.documentation_url || "",
        description: tool.description || "",
        how_to_use: tool.how_to_use || "",
        examples: tool.examples || "",
        logo_url: tool.logo_url || "",
        category_id: tool.category_id ? String(tool.category_id) : "",
        tag_ids: tool.tags?.map((t) => t.id) || [],
        role_ids: tool.suitable_for_roles || [],
      });
    } else {
      showToast("Инструментът не е намерен", "error");
      router.push("/tools");
      return;
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = {
      ...formData,
      category_id: parseInt(formData.category_id),
      suitable_for_roles: formData.role_ids,
    };

    const response = await api.put(`/api/tools/${params.id}`, submitData);

    if (response.data) {
      showToast("Инструментът е обновен успешно!", "success");
      router.push(`/tools/${params.id}`);
    } else {
      showToast(response.error || "Грешка при обновяване", "error");
    }

    setSubmitting(false);
  };

  const toggleTag = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter((id) => id !== tagId)
        : [...prev.tag_ids, tagId],
    }));
  };

  const toggleRole = (roleId: number) => {
    setFormData((prev) => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((id) => id !== roleId)
        : [...prev.role_ids, roleId],
    }));
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Редактирай AI инструмент
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Променете информацията за инструмента
            </p>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Основна информация
                </h3>

                <Input
                  label="Име на инструмента"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  fullWidth
                  placeholder="ChatGPT, Midjourney..."
                />

                <Textarea
                  label="Описание"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  fullWidth
                  rows={4}
                  placeholder="Кратко описание на инструмента..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="URL адрес"
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    fullWidth
                    placeholder="https://example.com"
                  />

                  <Input
                    label="Документация URL"
                    type="url"
                    value={formData.documentation_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documentation_url: e.target.value,
                      })
                    }
                    fullWidth
                    placeholder="https://docs.example.com"
                  />
                </div>

                <Input
                  label="Logo URL"
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                  fullWidth
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Категория <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Избери категория</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Roles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Подходящ за роли
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <label
                      key={role.id}
                      className={`
                        flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${
                          formData.role_ids.includes(role.id)
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary-300"
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.role_ids.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {role.display_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Тагове
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all
                        ${
                          formData.tag_ids.includes(tag.id)
                            ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-105"
                            : "opacity-75 hover:opacity-100"
                        }
                      `}
                      style={{
                        backgroundColor: tag.color,
                        color: "white",
                      }}
                    >
                      {tag.name}
                      {formData.tag_ids.includes(tag.id) && " \u2713"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Допълнителна информация
                </h3>

                <Textarea
                  label="Как се използва"
                  value={formData.how_to_use}
                  onChange={(e) =>
                    setFormData({ ...formData, how_to_use: e.target.value })
                  }
                  fullWidth
                  rows={4}
                  placeholder="Инструкции за използване..."
                />

                <Textarea
                  label="Примери"
                  value={formData.examples}
                  onChange={(e) =>
                    setFormData({ ...formData, examples: e.target.value })
                  }
                  fullWidth
                  rows={4}
                  placeholder="Примери за използване..."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Запазване..." : "Запази промените"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(`/tools/${params.id}`)}
                  className="flex-1"
                >
                  Отказ
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
