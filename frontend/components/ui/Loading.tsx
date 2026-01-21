export default function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="w-16 h-16 rounded-full border-4 border-primary-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Зареждане...</p>
      </div>
    </div>
  );
}
