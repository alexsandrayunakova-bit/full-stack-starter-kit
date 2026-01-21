export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 via-primary-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t-2 border-primary-200 dark:border-gray-700 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              © 2026 AI Tools Platform. Всички права запазени.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Alexa Yunakova
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <a
              href="/tools"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
            >
              Инструменти
            </a>
            <a
              href="/dashboard"
              className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 font-semibold transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/login"
              className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-semibold transition-colors"
            >
              Вход
            </a>
          </div>

          {/* Social or Additional Info */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span className="text-2xl">🤖</span>
            <span className="font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              AI Tools Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
