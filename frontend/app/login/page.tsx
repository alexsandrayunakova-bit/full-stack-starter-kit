"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      showToast("Успешно влизане!", "success");
      router.push("/dashboard");
    } else {
      showToast(result.error || "Грешка при вход", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Вход в системата
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
            AI Tools Platform
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
              placeholder="email@example.com"
            />

            <Input
              type="password"
              label="Парола"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              fullWidth
              placeholder="••••••••"
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Влизане..." : "Вход"}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Нямаш акаунт?{" "}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Регистрирай се
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
