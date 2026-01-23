"use client";

import Card, { CardBody } from "./Card";

interface StatCardProps {
  icon?: string;
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700",
  primary: "bg-gradient-to-br from-primary-500 to-primary-700 text-white border-0",
  secondary: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-white border-0",
  success: "bg-gradient-to-br from-green-500 to-green-700 text-white border-0",
  warning: "bg-gradient-to-br from-yellow-500 to-yellow-700 text-white border-0",
  danger: "bg-gradient-to-br from-red-500 to-red-700 text-white border-0",
  info: "bg-gradient-to-br from-info-500 to-info-700 text-white border-0",
};

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  variant = "default",
  onClick
}: StatCardProps) {
  const isGradient = variant !== "default";
  const textColor = isGradient
    ? "text-white"
    : "text-slate-800 dark:text-slate-100";
  const subtitleColor = isGradient
    ? "text-white/80"
    : "text-slate-600 dark:text-slate-400";

  return (
    <Card
      className={`
        ${variantStyles[variant]}
        shadow-lg hover:shadow-xl transition-all
        ${onClick ? "cursor-pointer hover:scale-105" : ""}
      `}
      onClick={onClick}
    >
      <CardBody className="text-center py-6 md:py-8">
        {icon && (
          <div className="text-4xl md:text-5xl mb-3">{icon}</div>
        )}
        <div className={`text-5xl md:text-6xl font-extrabold mb-2 ${textColor}`}>
          {value}
        </div>
        <div className={`font-semibold text-base md:text-lg mb-1 ${textColor}`}>
          {title}
        </div>
        {subtitle && (
          <div className={`text-xs md:text-sm ${subtitleColor}`}>
            {subtitle}
          </div>
        )}
        {trend && (
          <div className={`mt-3 text-sm font-medium ${
            trend.isPositive
              ? isGradient ? "text-white/90" : "text-green-600 dark:text-green-400"
              : isGradient ? "text-white/90" : "text-red-600 dark:text-red-400"
          }`}>
            <span className="mr-1">
              {trend.isPositive ? "↑" : "↓"}
            </span>
            {trend.value}% {trend.label}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
