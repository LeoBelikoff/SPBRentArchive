import { useState, useCallback, useEffect } from "react";
import { loadAppData } from "@/lib/dataStorage";

export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number | string;
  bathrooms: number | string;
  area: number;
  status: "available" | "limited" | "booked";
  images: string[];
  amenities: string[];
  address: string;
  description: string;
  lat: number;
  lng: number;
}

// Sample St. Petersburg properties with real coordinates
const initialProperties: Property[] = [
  {
    id: "1",
    title: "Роскошный Лофт в Центре",
    price: 85000,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    status: "available",
    images: [
      "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Гостиная",
      "https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Спальня",
      "https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Кухня",
    ],
    amenities: [
      "Кондиционер",
      "Балкон",
      "Парковка",
      "Интернет",
      "Безопасность",
    ],
    address: "Невский проспект, 28, Санкт-Петербург",
    description:
      "Элегантный лофт в самом сердце Санкт-Петербурга с панорамными окнами и современным дизайном. Идеально подходит для молодых профессионалов.",
    lat: 59.9342,
    lng: 30.335,
  },
  {
    id: "2",
    title: "Современные Семейные Апартаменты",
    price: 120000,
    bedrooms: 3,
    bathrooms: 2.5,
    area: 160,
    status: "limited",
    images: [
      "https://via.placeholder.com/800x600/059669/FFFFFF?text=Детская",
      "https://via.placeholder.com/800x600/EA580C/FFFFFF?text=Зал",
      "https://via.placeholder.com/800x600/7C2D12/FFFFFF?text=Ванная",
    ],
    amenities: ["Детская площадка", "Спортзал", "Консьерж", "Прачечная", "Сад"],
    address: "ул. Рубинштейна, 15, Санкт-Петербург",
    description:
      "Просторные семейные апартаменты в историческом центре города. Отлично подходят для семей с детьми.",
    lat: 59.928,
    lng: 30.3515,
  },
  {
    id: "3",
    title: "Уютная Студия у Эрмитажа",
    price: 55000,
    bedrooms: "Студия",
    bathrooms: 1,
    area: 75,
    status: "available",
    images: [
      "https://via.placeholder.com/800x600/0891B2/FFFFFF?text=Студия",
      "https://via.placeholder.com/800x600/BE185D/FFFFFF?text=Балкон",
      "https://via.placeholder.com/800x600/15803D/FFFFFF?text=Прихожая",
    ],
    amenities: ["Мебель", "Кухня", "WiFi", "Близко к метро", "Магазины рядом"],
    address: "Дворцовая набережная, 4, Санкт-Петербург",
    description:
      "Компактная и стильная студия рядом с Эрмитажем. Идеально для краткосрочной аренды и туристов.",
    lat: 59.9398,
    lng: 30.3146,
  },
  {
    id: "4",
    title: "Элитные Апартаменты на Васильевском",
    price: 150000,
    bedrooms: 2,
    bathrooms: 2,
    area: 140,
    status: "booked",
    images: [
      "https://via.placeholder.com/800x600/6366F1/FFFFFF?text=Терраса",
      "https://via.placeholder.com/800x600/EF4444/FFFFFF?text=Камин",
      "https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Джакузи",
    ],
    amenities: [
      "Терраса",
      "Камин",
      "Джакузи",
      "Консьерж",
      "Видеонаблюдение",
      "Парковка",
    ],
    address: "Университетская набережная, 17, Санкт-Петербург",
    description:
      "Роскошные апартаменты на Васильевском острове с видом на Неву. Премиум-класс с эксклюзивными удобствами.",
    lat: 59.942,
    lng: 30.2991,
  },
];

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadAppData();
    if (savedData && savedData.properties.length > 0) {
      setProperties(savedData.properties);
    }
  }, []);

  const addProperty = useCallback((property: Property) => {
    setProperties((prev) => [...prev, property]);
  }, []);

  const updateProperty = useCallback((updatedProperty: Property) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === updatedProperty.id ? updatedProperty : property,
      ),
    );
  }, []);

  const deleteProperty = useCallback((propertyId: string) => {
    setProperties((prev) =>
      prev.filter((property) => property.id !== propertyId),
    );
  }, []);

  const getPropertyById = useCallback(
    (propertyId: string) => {
      return properties.find((property) => property.id === propertyId);
    },
    [properties],
  );

  const getAvailableProperties = useCallback(() => {
    return properties.filter((property) => property.status === "available");
  }, [properties]);

  const searchProperties = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return properties.filter(
        (property) =>
          property.title.toLowerCase().includes(lowercaseQuery) ||
          property.address.toLowerCase().includes(lowercaseQuery) ||
          property.amenities.some((amenity) =>
            amenity.toLowerCase().includes(lowercaseQuery),
          ),
      );
    },
    [properties],
  );

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    getAvailableProperties,
    searchProperties,
  };
}
