"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";
import type { Role } from "@/lib/types";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const response = await api.get<{ data: Role[] }>("/api/roles");
    if (response.data && response.data.data) {
      setRoles(response.data.data);
      // Set default role to first one
      if (response.data.data.length > 0) {
        setFormData((prev) => ({ ...prev, role_id: response.data.data[0].id.toString() }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      showToast("Паролите не съвпадат", "error");
      return;
    }

    if (formData.password.length < 8) {
      showToast("Паролата трябва да е поне 8 символа", "error");
      return;
    }

    setLoading(true);

    const result = await register({
      ...formData,
      role_id: parseInt(formData.role_id),
    });

    if (result.success) {
      showToast("Успешна регистрация! Добре дошли!", "success");
      router.push("/dashboard");
    } else {
      showToast(result.error || "Грешка при регистрация", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-2xl border-2 border-secondary-200">
        <CardHeader>
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
            Регистрация
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2 font-semibold">
            Създайте нов акаунт в AI Tools Platform
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Име"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
              placeholder="Вашето име"
            />

            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
              placeholder="email@example.com"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Роля <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.display_name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Изберете вашата роля в екипа
              </p>
            </div>

            <Input
              type="password"
              label="Парола"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              fullWidth
              placeholder="Минимум 8 символа"
            />

            <Input
              type="password"
              label="Потвърди парола"
              value={formData.password_confirmation}
              onChange={(e) =>
                setFormData({ ...formData, password_confirmation: e.target.value })
              }
              required
              fullWidth
              placeholder="Въведете паролата отново"
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Регистриране..." : "Регистрирай се"}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Вече имаш акаунт?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Влез
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
      </div>
      <Footer simple />
    </div>
  );
}
