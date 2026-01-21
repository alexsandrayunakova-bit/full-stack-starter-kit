"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LoadingPage } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import type { AiTool } from "@/lib/types";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tools, setTools] = useState<AiTool[]>([]);
  const [stats, setStats] = useState({
    totalTools: 0,
    myTools: 0,
    recentViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);

    // Зареждане на инструменти
    const response = await api.get<{ data: AiTool[] }>("/api/tools?per_page=6");

    if (response.data && response.data.data) {
      const toolsData = response.data.data;
      setTools(toolsData);

      // Изчисляване на статистики
      const myToolsCount = toolsData.filter((t) => t.created_by === user?.id).length;
      const totalViews = toolsData.reduce((sum, t) => sum + t.views_count, 0);

      setStats({
        totalTools: toolsData.length,
        myTools: myToolsCount,
        recentViews: totalViews,
      });
    }

    setLoading(false);
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Добре дошъл, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
            Роля: <Badge variant="primary">{user.role?.display_name || "Потребител"}</Badge>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2">{stats.totalTools}</div>
              <div className="text-primary-100 font-bold text-lg">Общо инструменти</div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2">{stats.myTools}</div>
              <div className="text-secondary-100 font-bold text-lg">Мои инструменти</div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-info-500 to-info-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <CardBody className="text-center py-8">
              <div className="text-6xl font-extrabold mb-2">{stats.recentViews}</div>
              <div className="text-info-100 font-bold text-lg">Прегледи</div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Бързи действия</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/tools/new"
                className="p-6 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-all border-2 border-primary-200 dark:border-primary-800 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">➕</div>
                <div className="font-semibold text-gray-900 dark:text-white">Добави нов тул</div>
              </Link>

              <Link
                href="/tools"
                className="p-6 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-lg transition-all border-2 border-secondary-200 dark:border-secondary-800 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔍</div>
                <div className="font-semibold text-gray-900 dark:text-white">Разгледай инструменти</div>
              </Link>

              <Link
                href="/profile"
                className="p-6 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all border-2 border-green-200 dark:border-green-800 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👤</div>
                <div className="font-semibold text-gray-900 dark:text-white">Моят профил</div>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Recent Tools */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Последни инструменти</h2>
              <Link href="/tools" className="text-primary-600 hover:text-primary-700 font-medium">
                Виж всички →
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {tools.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-lg font-medium">Все още няма инструменти</p>
                <Link href="/tools/new" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                  Добави първия инструмент
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all border border-gray-200 dark:border-gray-700 group"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <span>{tool.category?.name}</span>
                      <span>{tool.views_count} прегледа</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
