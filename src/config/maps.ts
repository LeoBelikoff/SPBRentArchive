// Yandex Maps API configuration

// В разработке карты работают без API ключа, но с ограничениями
// Для продакшена обязательно нужен API ключ от Яндекс.Карт
export const YANDEX_MAPS_CONFIG = {
  // Получить API ключ можно на https://developer.tech.yandex.ru/
  apiKey: import.meta.env.VITE_YANDEX_MAPS_API_KEY || "",

  // Язык интерфейса карт
  lang: "ru_RU",

  // Настройки по умолчанию для Санкт-Петербурга
  defaultCenter: [59.9311, 30.3609] as [number, number],
  defaultZoom: 11,

  // Настройки для мини-карты в админке
  miniMapZoom: 15,
};

// Проверка наличия API ключа для продакшена
export const isProductionReady = () => {
  return Boolean(YANDEX_MAPS_CONFIG.apiKey);
};

// Получение параметров запроса для Яндекс Карт
export const getYandexMapsQuery = () => {
  const query: any = {
    lang: YANDEX_MAPS_CONFIG.lang,
  };

  if (YANDEX_MAPS_CONFIG.apiKey) {
    query.apikey = YANDEX_MAPS_CONFIG.apiKey;
  }

  return query;
};
