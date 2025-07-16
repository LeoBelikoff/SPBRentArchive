import { useState, useEffect } from "react";

export interface NavigationPage {
  id: string;
  title: string;
  content: string;
  isEditable: boolean;
}

const defaultNavigationPages: NavigationPage[] = [
  {
    id: "details",
    title: "Детали квартир",
    content: `# Детали квартир

Добро пожаловать в раздел детальной информации о наших квартирах!

## Что вы найдете здесь:

### 📋 Подробные характеристики
- Полные технические характеристики каждой квартиры
- Планировки и размеры комнат
- Состояние ремонта и мебелировка

### 📸 Фотогалереи
- Профессиональные фотографии всех комнат
- Виды из окон и балконов
- Детали интерьера и удобств

### 🏢 Информация о здании
- Год постройки и материалы
- Инфраструктура района
- Транспортная доступность

### 📍 Расположение
- Интерактивные карты
- Ближайшие объекты инфраструктуры
- Остановки общественного транспорта

Выберите квартиру на главной странице, чтобы увидеть все детали!`,
    isEditable: true,
  },
  {
    id: "contacts",
    title: "Контактная информация",
    content: `# Свяжитесь с нами

Мы всегда готовы помочь вам найти идеальную квартиру!

## 📞 Телефоны
- **Основной:** +7 (495) 123-45-67
- **WhatsApp:** +7 (985) 123-45-67
- **Время работы:** Пн-Вс, 9:00-20:00

## 📧 Электронная почта
- **Общие вопросы:** info@rental-hub.ru
- **Бронирование:** booking@rental-hub.ru
- **Поддержка:** support@rental-hub.ru

## 🏢 Офис
**Адрес:** г. Санкт-Петербург, Невский проспект, 28, офис 15
**Метро:** Невский проспект (3 минуты пешком)
**Время работы:** Пн-Пт 10:00-19:00, Сб 11:00-16:00

## 💬 Онлайн-консультации
- **Telegram:** @rental_hub_spb
- **Онлайн-чат:** Доступен на сайте 24/7
- **Видеосвязь:** По предварительной записи

## 🚗 Как добраться
### На метро:
- Невский проспект (зеленая/синяя линия)
- Гостиный двор (зеленая линия)

### На автомобиле:
Парковка доступна во дворе дома (платная, 100₽/час)

Мы ждем вас!`,
    isEditable: true,
  },
];

export function useNavigation() {
  const [navigationPages, setNavigationPages] = useState<NavigationPage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("apartment-rental-navigation");
    if (saved) {
      try {
        setNavigationPages(JSON.parse(saved));
      } catch {
        setNavigationPages(defaultNavigationPages);
      }
    } else {
      setNavigationPages(defaultNavigationPages);
    }
  }, []);

  const updateNavigationPage = (
    id: string,
    updates: Partial<NavigationPage>,
  ) => {
    setNavigationPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, ...updates } : page)),
    );
  };

  const saveNavigationPages = () => {
    localStorage.setItem(
      "apartment-rental-navigation",
      JSON.stringify(navigationPages),
    );
  };

  const resetToDefaults = () => {
    setNavigationPages(defaultNavigationPages);
    localStorage.setItem(
      "apartment-rental-navigation",
      JSON.stringify(defaultNavigationPages),
    );
  };

  const getPageById = (id: string) => {
    return navigationPages.find((page) => page.id === id);
  };

  return {
    navigationPages,
    updateNavigationPage,
    saveNavigationPages,
    resetToDefaults,
    getPageById,
  };
}
