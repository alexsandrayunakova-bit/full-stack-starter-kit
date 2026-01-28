"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";
import type { AiTool, ToolRecommendation } from "@/lib/types";

interface ToolShowResponse {
  tool: AiTool;
  average_rating: number | null;
  recommendations_count: number;
}

function StarRating({
  rating,
  onRate,
  interactive = false,
  size = "md",
}: {
  rating: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${sizeClasses[size]} ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          }`}
        >
          {star <= (hovered || rating) ? (
            <span className="text-yellow-400">&#9733;</span>
          ) : (
            <span className="text-gray-300 dark:text-gray-600">&#9733;</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [tool, setTool] = useState<AiTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recommendation form state
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    if (params.id) {
      loadTool();
    }
  }, [params.id]);

  const loadTool = async () => {
    setLoading(true);
    setError(null);

    const response = await api.get<ToolShowResponse>(
      `/api/tools/${params.id}`
    );

    if (response.data) {
      const data = response.data;
      const toolData = data.tool || data;
      if (data.average_rating !== undefined) {
        toolData.average_rating = data.average_rating;
      }
      if (data.recommendations_count !== undefined) {
        toolData.recommendations_count = data.recommendations_count;
      }
      setTool(toolData);
    } else {
      setError(response.error || "Инструментът не е намерен");
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

  const userRecommendation =
    user && tool?.recommendations
      ? tool.recommendations.find((r) => r.user_id === user.id)
      : null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newRating === 0) {
      showToast("Моля, изберете оценка", "error");
      return;
    }

    setSubmittingReview(true);

    const response = await api.post("/api/recommendations", {
      tool_id: tool?.id,
      rating: newRating,
      comment: newComment.trim() || null,
    });

    if (response.data) {
      showToast("Отзивът е добавен успешно!", "success");
      setNewRating(0);
      setNewComment("");
      loadTool();
    } else {
      showToast(response.error || "Грешка при добавяне на отзив", "error");
    }

    setSubmittingReview(false);
  };

  const handleUpdateReview = async (id: number) => {
    if (editRating === 0) {
      showToast("Моля, изберете оценка", "error");
      return;
    }

    const response = await api.put(`/api/recommendations/${id}`, {
      rating: editRating,
      comment: editComment.trim() || null,
    });

    if (response.data) {
      showToast("Отзивът е обновен успешно!", "success");
      setEditingReviewId(null);
      loadTool();
    } else {
      showToast(response.error || "Грешка при обновяване", "error");
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете отзива?")) return;

    const response = await api.delete(`/api/recommendations/${id}`);

    if (response.data || !response.error) {
      showToast("Отзивът е изтрит", "success");
      loadTool();
    } else {
      showToast(response.error || "Грешка при изтриване", "error");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !tool) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">&#128533;</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Инструментът не е намерен"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Инструментът, който търсите, не съществува или е бил премахнат.
          </p>
          <Link
            href="/tools"
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Към инструментите
          </Link>
        </div>
      </AppLayout>
    );
  }

  const canEdit =
    user && (user.id === tool.created_by || user.role?.name === "owner");

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
                        Редактирай
                      </Button>
                      <Button variant="danger" size="sm" onClick={handleDelete}>
                        Изтрий
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{tool.views_count} прегледа</span>
                  {tool.average_rating != null && tool.average_rating > 0 && (
                    <span className="flex items-center gap-1">
                      <StarRating rating={Math.round(tool.average_rating)} size="sm" />
                      <span>{tool.average_rating.toFixed(1)}</span>
                    </span>
                  )}
                  {tool.recommendations_count !== undefined &&
                    tool.recommendations_count > 0 && (
                      <span>{tool.recommendations_count} отзива</span>
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
                  Отвори инструмента
                </a>
              )}
              {tool.documentation_url && (
                <a
                  href={tool.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors"
                >
                  Документация
                </a>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Тагове
              </h2>
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Примери
              </h2>
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

        {/* Recommendations / Reviews Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Отзиви и рейтинг
              </h2>
              {tool.average_rating != null && tool.average_rating > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(tool.average_rating)} size="sm" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tool.average_rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({tool.recommendations_count || 0} отзива)
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {/* Add Review Form */}
            {isAuthenticated && !userRecommendation ? (
              <form
                onSubmit={handleSubmitReview}
                className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Добавете вашия отзив
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Оценка
                  </label>
                  <StarRating
                    rating={newRating}
                    onRate={setNewRating}
                    interactive
                    size="lg"
                  />
                </div>

                <div className="mb-4">
                  <Textarea
                    label="Коментар (по желание)"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    fullWidth
                    rows={3}
                    placeholder="Споделете вашия опит с този инструмент..."
                  />
                </div>

                <Button type="submit" disabled={submittingReview || newRating === 0}>
                  {submittingReview ? "Изпраща се..." : "Публикувай отзив"}
                </Button>
              </form>
            ) : isAuthenticated && userRecommendation ? (
              <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-green-800 dark:text-green-300 text-sm">
                  Вие вече сте добавили отзив за този инструмент. Можете да
                  го редактирате или изтриете по-долу.
                </p>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  <Link href="/login" className="font-semibold underline">
                    Влезте в системата
                  </Link>{" "}
                  за да добавите отзив.
                </p>
              </div>
            )}

            {/* Reviews List */}
            {tool.recommendations && tool.recommendations.length > 0 ? (
              <div className="space-y-4">
                {tool.recommendations.map((rec: ToolRecommendation) => (
                  <div
                    key={rec.id}
                    className={`p-5 rounded-xl border ${
                      rec.user_id === user?.id
                        ? "border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {editingReviewId === rec.id ? (
                      // Edit mode
                      <div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Оценка
                          </label>
                          <StarRating
                            rating={editRating}
                            onRate={setEditRating}
                            interactive
                          />
                        </div>
                        <Textarea
                          label="Коментар"
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          fullWidth
                          rows={3}
                        />
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateReview(rec.id)}
                          >
                            Запази
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingReviewId(null)}
                          >
                            Отказ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {rec.user?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {rec.user?.name || "Анонимен"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {rec.user?.role?.display_name || "Потребител"}
                                {rec.created_at && (
                                  <>
                                    {" "}
                                    &middot;{" "}
                                    {new Date(rec.created_at).toLocaleDateString(
                                      "bg-BG"
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {rec.rating && (
                              <StarRating rating={rec.rating} size="sm" />
                            )}
                            {rec.user_id === user?.id && (
                              <div className="flex gap-1 ml-2">
                                <button
                                  onClick={() => {
                                    setEditingReviewId(rec.id);
                                    setEditRating(rec.rating || 0);
                                    setEditComment(rec.comment || "");
                                  }}
                                  className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                                  title="Редактирай"
                                >
                                  &#9998;
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(rec.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Изтрий"
                                >
                                  &#10005;
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {rec.comment && (
                          <p className="mt-3 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {rec.comment}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Все още няма отзиви. Бъдете първи!
              </p>
            )}
          </CardBody>
        </Card>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/tools"
            className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            &larr; Назад към инструментите
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
