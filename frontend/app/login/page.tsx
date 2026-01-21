"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SimpleNavbar from "@/components/layout/SimpleNavbar";
import Footer from "@/components/layout/Footer";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <SimpleNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-24">
        <Card className="w-full max-w-md shadow-2xl border-2 border-primary-200">
        <CardHeader>
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Вход в системата
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2 font-semibold">
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
      <Footer />
    </div>
  );
}
