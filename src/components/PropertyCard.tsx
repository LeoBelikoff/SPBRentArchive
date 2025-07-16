import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type PropertyStatus = "available" | "limited" | "booked";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  bedrooms?: number | string;
  bathrooms?: number | string;
  area: number;
  status: PropertyStatus;
  images: string[];
  amenities: string[];
  onViewDetails?: (id: string) => void;
  onCheckAvailability?: (id: string) => void;
}

const statusConfig = {
  available: {
    color: "bg-status-available text-white",
    label: "Доступно",
  },
  limited: {
    color: "bg-status-limited text-white",
    label: "Ограничено",
  },
  booked: {
    color: "bg-status-booked text-white",
    label: "Забронировано",
  },
};

export function PropertyCard({
  id,
  title,
  price,
  bedrooms,
  bathrooms,
  area,
  status,
  images,
  amenities,
  onViewDetails,
  onCheckAvailability,
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const statusInfo = statusConfig[status];

  return (
    <Card className="overflow-hidden bg-white shadow-sm border-neutral-200 hover:shadow-md transition-shadow duration-300 animate-fade-in">
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery */}
        <div className="relative w-full lg:w-1/2 h-64 lg:h-80 flex-shrink-0">
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Предыдущее изображение"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Следующее изображение"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75",
                    )}
                    aria-label={`Изображение ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Status Badge */}
          <Badge
            className={cn(
              "absolute top-4 left-4 font-medium",
              statusInfo.color,
            )}
          >
            {statusInfo.label}
          </Badge>
        </div>

        {/* Property Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-neutral-900 leading-tight">
                {title}
              </h3>
              <div className="text-right ml-4 flex-shrink-0">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-brand-orange">
                    {price.toLocaleString("ru-RU")} ₽
                  </span>
                  <span className="text-sm text-neutral-500 ml-1">/мес</span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-neutral-900">
                  {bedrooms}
                </div>
                <div className="text-sm text-neutral-600">
                  {typeof bedrooms === "string" ? "Планировка" : "Спальни"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-neutral-900">
                  {bathrooms}
                </div>
                <div className="text-sm text-neutral-600">
                  {typeof bathrooms === "string" ? "Санузел" : "Ванные"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-neutral-900">
                  {area}
                </div>
                <div className="text-sm text-neutral-600">кв.м</div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-6 flex-1">
              {amenities.map((amenity, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs px-3 py-1 h-6 min-w-[60px] flex items-center justify-center whitespace-nowrap"
                >
                  {amenity}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <Button
                onClick={() => onViewDetails?.(id)}
                className="flex-1 bg-brand-orange hover:bg-brand-500 text-white font-medium"
              >
                Подробности
              </Button>
              <Button
                onClick={() => onCheckAvailability?.(id)}
                variant="outline"
                className="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Проверить доступность
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
