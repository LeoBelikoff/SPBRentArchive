import {
  Home,
  Phone,
  Mail,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-neutral-100 mt-16">
      <div className="max-w-8xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Центр Аренды Квартир</h3>
            </div>
            <p className="text-neutral-300 mb-6 max-w-md leading-relaxed">
              Откройте для себя идеальную квартиру для аренды с нашей
              кураторской коллекцией премиальных апартаментов с интерактивными
              картами, подробными галереями и календарями доступности в времени.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-neutral-700 hover:bg-brand-orange rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-700 hover:bg-brand-orange rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-700 hover:bg-brand-orange rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Быстрые ссылки</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-neutral-300 hover:text-brand-orange transition-colors"
                >
                  Главная
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-300 hover:text-brand-orange transition-colors"
                >
                  Карта объектов
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-300 hover:text-brand-orange transition-colors"
                >
                  Детали квартир
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-300 hover:text-brand-orange transition-colors"
                >
                  Доступность
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-300 hover:text-brand-orange transition-colors"
                >
                  О нас
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <div>
                  <div className="text-neutral-200">+7 (495) 123-45-67</div>
                  <div className="text-sm text-neutral-400">
                    Звонки с 9:00 до 20:00
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <div>
                  <div className="text-neutral-200">info@rental-hub.ru</div>
                  <div className="text-sm text-neutral-400">
                    Ответим в течение 2 часов
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <div>
                  <div className="text-neutral-200">Онлайн чат</div>
                  <div className="text-sm text-neutral-400">Поддержка 24/7</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-neutral-400 text-sm">
            © {currentYear} Центр Аренды Квартир. Все права защищены.
          </div>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-neutral-400 hover:text-brand-orange transition-colors"
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              className="text-neutral-400 hover:text-brand-orange transition-colors"
            >
              Условия использования
            </a>
            <a
              href="#"
              className="text-neutral-400 hover:text-brand-orange transition-colors"
            >
              Поддержка
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
