import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <main className="container mx-auto px-4 py-16 text-center flex-1 flex items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 bg-clip-text text-transparent animate-gradient">
          AI Tools Platform
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-medium">
          Управлявайте и каталогизирайте AI инструменти с лекота.
          Открийте перфектните инструменти за вашия екип.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Към Dashboard
          </Link>

          <Link
            href="/tools"
            className="px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Разгледай инструменти
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-primary-200 hover:border-primary-400">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2 text-primary-700 dark:text-primary-400">Търсене и филтриране</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Намерете точно това, което търсите с мощни филтри
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-secondary-200 hover:border-secondary-400">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2 text-secondary-700 dark:text-secondary-400">Роли и категории</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Организирайте инструменти по роли и категории
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-accent-200 hover:border-accent-400">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 text-accent-700 dark:text-accent-400">Бърз достъп</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Моментален достъп до най-използваните инструменти
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
