import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useState } from "react";
import { YANDEX_MAPS_CONFIG, getYandexMapsQuery } from "@/config/maps";

interface Property {
  id: string;
  title: string;
  price: number;
  status: "available" | "limited" | "booked";
  lat: number;
  lng: number;
  address: string;
}

interface YandexMapProps {
  properties: Property[];
  onPropertySelect?: (propertyId: string) => void;
  height?: string;
  width?: string;
}

const statusColors = {
  available: "#22c55e", // Green
  limited: "#f39c12", // Orange
  booked: "#e74c3c", // Red
};

const statusLabels = {
  available: "Доступно",
  limited: "Ограничено",
  booked: "Забронировано",
};

export function YandexMap({
  properties,
  onPropertySelect,
  height = "400px",
  width = "100%",
}: YandexMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Center on St. Petersburg
  const defaultCenter = YANDEX_MAPS_CONFIG.defaultCenter;
  const defaultZoom = YANDEX_MAPS_CONFIG.defaultZoom;

  const handlePlacemarkClick = (propertyId: string) => {
    setSelectedProperty(propertyId);
    onPropertySelect?.(propertyId);
  };

  const createPlacemarkIcon = (status: Property["status"]) => {
    return {
      iconLayout: "default#image",
      iconImageHref: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="12" fill="${statusColors[status]}" stroke="white" stroke-width="3"/>
          <text x="15" y="19" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">₽</text>
        </svg>
      `)}`,
      iconImageSize: [30, 30],
      iconImageOffset: [-15, -15],
    };
  };

  const createBalloonContent = (property: Property) => {
    return `
      <div style="padding: 12px; min-width: 200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
        <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 16px;">
          ${property.title}
        </h3>
        <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
          📍 ${property.address}
        </p>
        <p style="margin: 0 0 8px 0; color: #e67e22; font-weight: 600; font-size: 18px;">
          ${property.price.toLocaleString("ru-RU")} ₽/мес
        </p>
        <div style="
          background-color: ${statusColors[property.status]};
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
          margin-bottom: 8px;
        ">
          ${statusLabels[property.status]}
        </div>
        <br>
        <button
          onclick="window.selectProperty?.('${property.id}')"
          style="
            background-color: #e67e22;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.backgroundColor='#d97706'"
          onmouseout="this.style.backgroundColor='#e67e22'"
        >
          Подробнее
        </button>
      </div>
    `;
  };

  // Set up global function for balloon buttons
  if (typeof window !== "undefined") {
    (window as any).selectProperty = (propertyId: string) => {
      onPropertySelect?.(propertyId);
    };
  }

  // Calculate bounds to fit all properties
  const calculateMapBounds = () => {
    if (properties.length === 0) {
      return { center: defaultCenter, zoom: defaultZoom };
    }

    // If only one property, center on it
    if (properties.length === 1) {
      return {
        center: [properties[0].lat, properties[0].lng] as [number, number],
        zoom: 14,
      };
    }

    // For multiple properties, calculate bounds
    const lats = properties.map((p) => p.lat);
    const lngs = properties.map((p) => p.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate appropriate zoom level based on bounds
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 11;
    if (maxDiff < 0.01) zoom = 15;
    else if (maxDiff < 0.05) zoom = 13;
    else if (maxDiff < 0.1) zoom = 12;

    return {
      center: [centerLat, centerLng] as [number, number],
      zoom: zoom,
    };
  };

  const mapState = calculateMapBounds();

  return (
    <div style={{ height, width, borderRadius: "8px", overflow: "hidden" }}>
      <YMaps query={getYandexMapsQuery()}>
        <Map
          state={mapState}
          width={width}
          height={height}
          options={{
            suppressMapOpenBlock: true,
          }}
        >
          {properties.length > 0 ? (
            properties.map((property) => (
              <Placemark
                key={property.id}
                geometry={[property.lat, property.lng]}
                options={{
                  ...createPlacemarkIcon(property.status),
                  hideIconOnBalloonOpen: false,
                }}
                properties={{
                  balloonContent: createBalloonContent(property),
                }}
                onClick={() => handlePlacemarkClick(property.id)}
              />
            ))
          ) : (
            // Show message when no properties
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                textAlign: "center",
                pointerEvents: "none",
                zIndex: 1000,
              }}
            >
              <div style={{ color: "#6b7280", fontSize: "14px" }}>
                Нет объектов для отображения
              </div>
            </div>
          )}
        </Map>
      </YMaps>
    </div>
  );
}
