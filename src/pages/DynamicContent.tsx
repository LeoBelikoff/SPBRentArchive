import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useParams, Navigate } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { FileText, MessageCircle } from "lucide-react";

export default function DynamicContent() {
  const { pageId } = useParams<{ pageId: string }>();
  const { getPageById } = useNavigation();

  if (!pageId) {
    return <Navigate to="/" replace />;
  }

  const page = getPageById(pageId);

  if (!page) {
    return <Navigate to="/404" replace />;
  }

  const getIcon = () => {
    switch (pageId) {
      case "details":
        return <FileText className="w-6 h-6" />;
      case "contacts":
        return <MessageCircle className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      // Headers
      if (line.startsWith("# ")) {
        return (
          <h1
            key={index}
            className="text-3xl font-bold text-neutral-900 mb-6 mt-8 first:mt-0"
          >
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-semibold text-neutral-900 mb-4 mt-6"
          >
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-xl font-semibold text-neutral-900 mb-3 mt-4"
          >
            {line.substring(4)}
          </h3>
        );
      }

      // Lists
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="text-neutral-700 mb-2 ml-4">
            {line.substring(2)}
          </li>
        );
      }

      // Bold text
      if (line.includes("**")) {
        const parts = line.split("**");
        return (
          <p key={index} className="text-neutral-700 mb-4 leading-relaxed">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold text-neutral-900">
                  {part}
                </strong>
              ) : (
                part
              ),
            )}
          </p>
        );
      }

      // Empty lines
      if (line.trim() === "") {
        return <div key={index} className="mb-2" />;
      }

      // Regular paragraphs
      return (
        <p key={index} className="text-neutral-700 mb-4 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-neutral-200">
          <div className="max-w-8xl mx-auto px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center text-brand-orange">
                  {getIcon()}
                </div>
                <h1 className="text-4xl font-bold text-neutral-900">
                  {page.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-8">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
              <div className="prose prose-neutral max-w-none">
                {renderContent(page.content)}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-8xl mx-auto px-8 text-center">
            <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Готовы найти идеальную квартиру?
              </h2>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                Свяжитесь с нами прямо сейчас, и мы поможем вам выбрать лучший
                вариант из нашей коллекции премиальных квартир в
                Санкт-Петербурге.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+74951234567"
                  className="bg-brand-orange hover:bg-brand-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  📞 Позвонить сейчас
                </a>
                <a
                  href="mailto:info@rental-hub.ru"
                  className="border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  ✉️ Написать email
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
