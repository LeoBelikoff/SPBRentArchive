import { Card } from "@/components/ui/card";
import { YandexMap } from "./YandexMap";

interface Property {
  id: string;
  title: string;
  price: number;
  status: "available" | "limited" | "booked";
  lat: number;
  lng: number;
  address: string;
}

interface MapSidebarProps {
  properties: Property[];
  onPropertySelect?: (propertyId: string) => void;
}

export function MapSidebar({ properties, onPropertySelect }: MapSidebarProps) {
  return (
    <div className="sticky top-24">
      <Card className="p-6 bg-white border-neutral-200">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-neutral-900">
              Расположение объектов
            </h2>
            <div className="bg-brand-orange/10 text-brand-orange px-2 py-1 rounded text-sm font-medium">
              {properties.length} объект
              {properties.length === 1
                ? ""
                : properties.length < 5
                  ? "а"
                  : "ов"}
            </div>
          </div>
          <p className="text-sm text-neutral-600">
            Нажмите на маркеры для просмотра деталей квартир
          </p>
        </div>

        {/* Yandex Map */}
        <div className="mb-4">
          <YandexMap
            properties={properties}
            onPropertySelect={onPropertySelect}
            height="400px"
          />
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">Легенда</h3>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-status-available rounded-full"></div>
            <span className="text-sm text-neutral-700">Доступно</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-status-limited rounded-full"></div>
            <span className="text-sm text-neutral-700">Ограничено</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-status-booked rounded-full"></div>
            <span className="text-sm text-neutral-700">Забронировано</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
