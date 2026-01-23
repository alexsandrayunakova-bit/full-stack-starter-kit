"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SimpleNavbar from "@/components/layout/SimpleNavbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/lib/api";
import type { Role } from "@/lib/types";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    company: "",
    date_of_birth: "",
    country: "",
    profession: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    maxLength: true,
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    noSpecialChars: true,
  });

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

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

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      maxLength: password.length <= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasDigit: /\d/.test(password),
      noSpecialChars: /^[a-zA-Z0-9]*$/.test(password),
    });
  };

  const isPasswordValid = () => {
    return (
      passwordValidation.minLength &&
      passwordValidation.maxLength &&
      passwordValidation.hasUppercase &&
      passwordValidation.hasLowercase &&
      passwordValidation.hasDigit &&
      passwordValidation.noSpecialChars
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      showToast(t("auth.registerError") + ": Passwords do not match", "error");
      return;
    }

    if (!isPasswordValid()) {
      showToast(t("auth.registerError") + ": Password requirements not met", "error");
      return;
    }

    setLoading(true);

    const result = await register({
      ...formData,
      role_id: parseInt(formData.role_id),
    });

    if (result.success) {
      showToast(t("auth.registerSuccess"), "success");
      router.push("/dashboard");
    } else {
      showToast(result.error || t("auth.registerError"), "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <SimpleNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-24">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-secondary-200">
        <CardHeader>
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
            {t("auth.register")}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2 font-semibold">
            Create new account in AI Tools Platform
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name and Email in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label={t("auth.name")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
                placeholder={t("auth.name")}
              />

              <Input
                type="email"
                label={t("auth.email")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                fullWidth
                placeholder="email@example.com"
              />
            </div>

            {/* Company and Profession in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label={t("auth.company")}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                fullWidth
                placeholder={t("auth.companyPlaceholder")}
              />

              <Input
                type="text"
                label={t("auth.profession")}
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                fullWidth
                placeholder={t("auth.professionPlaceholder")}
              />
            </div>

            {/* Date of Birth and Country in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label={t("auth.dateOfBirth")}
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                fullWidth
                max={new Date().toISOString().split('T')[0]}
              />

              <Input
                type="text"
                label={t("auth.country")}
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                fullWidth
                placeholder={t("auth.countryPlaceholder")}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.role")} <span className="text-red-500">*</span>
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
            </div>

            {/* Password field with toggle visibility and tooltip */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.password")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setShowPasswordTooltip(true)}
                  onBlur={() => setTimeout(() => setShowPasswordTooltip(false), 200)}
                  required
                  placeholder="8-12 characters"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Requirements Tooltip */}
              {showPasswordTooltip && (
                <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-gray-800 border-2 border-primary-500 rounded-lg shadow-xl w-full">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t("auth.passwordRequirements")}
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className={`flex items-center ${passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      <span className="mr-2">{passwordValidation.minLength ? '✓' : '○'}</span>
                      {t("auth.passwordMin")}
                    </li>
                    <li className={`flex items-center ${passwordValidation.maxLength ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <span className="mr-2">{passwordValidation.maxLength ? '✓' : '✗'}</span>
                      {t("auth.passwordMax")}
                    </li>
                    <li className={`flex items-center ${passwordValidation.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      <span className="mr-2">{passwordValidation.hasUppercase ? '✓' : '○'}</span>
                      {t("auth.passwordUppercase")}
                    </li>
                    <li className={`flex items-center ${passwordValidation.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      <span className="mr-2">{passwordValidation.hasLowercase ? '✓' : '○'}</span>
                      {t("auth.passwordLowercase")}
                    </li>
                    <li className={`flex items-center ${passwordValidation.hasDigit ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      <span className="mr-2">{passwordValidation.hasDigit ? '✓' : '○'}</span>
                      {t("auth.passwordDigit")}
                    </li>
                    <li className={`flex items-center ${passwordValidation.noSpecialChars ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <span className="mr-2">{passwordValidation.noSpecialChars ? '✓' : '✗'}</span>
                      {t("auth.passwordNoSpecial")}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Password confirmation field with toggle visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.passwordConfirm")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  required
                  placeholder={t("auth.passwordConfirmPlaceholder")}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label={showPasswordConfirmation ? "Hide password" : "Show password"}
                >
                  {showPasswordConfirmation ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" fullWidth disabled={loading || !isPasswordValid()}>
              {loading ? t("auth.registering") : t("auth.register")}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t("auth.hasAccount")}{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                {t("auth.loginLink")}
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
