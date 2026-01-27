"use client";

import { useState } from 'react';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { ToolRecommendation } from '@/lib/types';

interface ToolRecommendationsProps {
  toolId: number;
  recommendations?: ToolRecommendation[];
  averageRating?: number;
  onRecommendationAdded: () => void;
}

export default function ToolRecommendations({
  toolId,
  recommendations = [],
  averageRating,
  onRecommendationAdded,
}: ToolRecommendationsProps) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userHasRecommendation = recommendations.some(
    (rec) => rec.user_id === user?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast('Моля, напишете коментар', 'error');
      return;
    }

    setSubmitting(true);

    const response = await api.post('/api/recommendations', {
      tool_id: toolId,
      rating,
      comment: comment.trim(),
    });

    setSubmitting(false);

    if (response.data || !response.error) {
      showToast('Отзивът е добавен успешно', 'success');
      setComment('');
      setRating(5);
      setShowForm(false);
      onRecommendationAdded();
    } else {
      showToast(response.error || 'Грешка при добавяне на отзив', 'error');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Отзиви и оценки
            </h2>
            {averageRating && recommendations.length > 0 && (
              <div className="flex items-center gap-3">
                <StarRating value={averageRating} readonly size="md" showValue />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({recommendations.length} {recommendations.length === 1 ? 'отзив' : 'отзива'})
                </span>
              </div>
            )}
          </div>
          {isAuthenticated && !userHasRecommendation && !showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              ✍️ Напиши отзив
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {/* Add recommendation form */}
        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Вашата оценка
                </label>
                <StarRating
                  value={rating}
                  onChange={setRating}
                  size="lg"
                  showValue
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Вашият коментар
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Споделете вашето мнение за този инструмент..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Изпращане...' : 'Публикувай отзив'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setComment('');
                    setRating(5);
                  }}
                >
                  Откажи
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Recommendations list */}
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-gray-500 dark:text-gray-400">
              Все още няма отзиви за този инструмент.
            </p>
            {isAuthenticated && !showForm && (
              <Button
                onClick={() => setShowForm(true)}
                variant="secondary"
                className="mt-4"
              >
                Бъди първият, който ще напише отзив
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {rec.user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {rec.user?.name || 'Анонимен'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {rec.user?.role?.display_name || 'Потребител'}
                      </div>
                    </div>
                  </div>
                  <StarRating value={rec.rating} readonly size="sm" />
                </div>

                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {rec.comment}
                </p>

                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(rec.created_at).toLocaleDateString('bg-BG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Login prompt */}
        {!isAuthenticated && (
          <div className="text-center py-6 mt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Влезте в профила си, за да напишете отзив
            </p>
            <Button onClick={() => (window.location.href = '/login')}>
              Вход
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
