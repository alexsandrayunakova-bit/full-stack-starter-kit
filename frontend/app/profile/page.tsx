"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Потребителски профил
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управлявайте вашия акаунт и настройки
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </CardHeader>

          <CardBody>
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Име
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    {user.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Роля
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Badge variant="primary">
                      {user.role?.display_name || "Потребител"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Регистриран на
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    {new Date(user.created_at).toLocaleDateString("bg-BG")}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Действия с акаунта
            </h3>
          </CardHeader>

          <CardBody>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  ⚙️ Редактиране на профил
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                  Промяна на име, email или парола (функционалността ще бъде добавена скоро)
                </p>
                <button
                  disabled
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg opacity-50 cursor-not-allowed"
                >
                  Редактирай профила
                </button>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                  🚪 Изход от системата
                </h4>
                <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                  Излезте от вашия акаунт и се върнете към началния екран
                </p>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Изход
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Statistics (placeholder) */}
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Моята активност
            </h3>
          </CardHeader>

          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Добавени инструменти
                </div>
              </div>

              <div className="text-center p-6 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                <div className="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Написани отзиви
                </div>
              </div>

              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Любими инструменти
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
