import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { YANDEX_MAPS_CONFIG, getYandexMapsQuery } from "@/config/maps";

interface YandexMiniMapProps {
  lat: number;
  lng: number;
  className?: string;
  height?: string;
}

export function YandexMiniMap({
  lat,
  lng,
  className = "",
  height = "200px",
}: YandexMiniMapProps) {
  const center = [lat, lng];

  const markerIcon = {
    iconLayout: "default#image",
    iconImageHref: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#e67e22" stroke="white" stroke-width="2"/>
      </svg>
    `)}`,
    iconImageSize: [24, 24],
    iconImageOffset: [-12, -12],
  };

  return (
    <div
      style={{ height, width: "100%" }}
      className={`rounded-lg border border-neutral-200 shadow-sm overflow-hidden ${className}`}
    >
      <YMaps query={getYandexMapsQuery()}>
        <Map
          state={{
            center: center,
            zoom: YANDEX_MAPS_CONFIG.miniMapZoom,
          }}
          width="100%"
          height={height}
          options={{
            suppressMapOpenBlock: true,
            controls: [], // Убираем элементы управления для мини-карты
          }}
        >
          <Placemark geometry={center} options={markerIcon} />
        </Map>
      </YMaps>
    </div>
  );
}
