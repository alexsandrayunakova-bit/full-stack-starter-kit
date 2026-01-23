"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Button from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  children?: ReactNode;
}

export default function EmptyState({ icon = "📭", title, description, action, children }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-6xl md:text-8xl mb-4">{icon}</div>
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link href={action.href}>
              <Button className="inline-flex items-center gap-2">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button onClick={action.onClick} className="inline-flex items-center gap-2">
              {action.label}
            </Button>
          )}
        </div>
      )}
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}
