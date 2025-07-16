import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="text-center max-w-md">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-brand-orange mb-4">404</div>
            <div className="text-6xl mb-4">🏠</div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Страница не найдена
          </h1>
          <p className="text-neutral-600 mb-8 leading-relaxed">
            К сожалению, страница, которую вы ищете, не существует. Возможно,
            она была перемещена или удалена.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-brand-orange hover:bg-brand-500 text-white font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-6 bg-white rounded-lg border border-neutral-200">
            <h2 className="font-semibold text-neutral-900 mb-3">
              Может быть полезно:
            </h2>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Проверьте правильность введенного адреса</li>
              <li>• Перейдите на главную страницу</li>
              <li>• Свяжитесь с нами, если проблема повторяется</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
