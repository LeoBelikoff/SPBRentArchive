// Geocoding utility for converting addresses to coordinates
// Uses Nominatim (OpenStreetMap) API for free geocoding

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  isInStPetersburg: boolean;
}

// St. Petersburg bounds for validation
const ST_PETERSBURG_BOUNDS = {
  north: 60.1,
  south: 59.7,
  east: 30.8,
  west: 29.5,
};

// Default St. Petersburg coordinates (center)
export const ST_PETERSBURG_CENTER = {
  lat: 59.9311,
  lng: 30.3609,
};

/**
 * Geocode an address to coordinates using Yandex Geocoder API
 * @param address - The address to geocode
 * @returns Promise with coordinates and validation info
 */
export async function geocodeAddress(
  address: string,
): Promise<GeocodingResult | null> {
  try {
    // Add "Санкт-Петербург" to the search if not already present
    const searchAddress =
      address.toLowerCase().includes("санкт-петербург") ||
      address.toLowerCase().includes("спб") ||
      address.toLowerCase().includes("питер") ||
      address.toLowerCase().includes("st petersburg")
        ? address
        : `${address}, Санкт-Петербург, Россия`;

    const encodedAddress = encodeURIComponent(searchAddress);

    // Try Yandex Geocoder first (better for Russian addresses)
    try {
      const yandexUrl = `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${encodedAddress}&lang=ru_RU&results=1`;
      const yandexResponse = await fetch(yandexUrl);
      const yandexData = await yandexResponse.json();

      if (yandexData.response?.GeoObjectCollection?.featureMember?.length > 0) {
        const geoObject =
          yandexData.response.GeoObjectCollection.featureMember[0].GeoObject;
        const coordinates = geoObject.Point.pos.split(" ");
        const lng = parseFloat(coordinates[0]);
        const lat = parseFloat(coordinates[1]);

        // Check if coordinates are within St. Petersburg bounds
        const isInStPetersburg = isWithinStPetersburg(lat, lng);

        return {
          lat,
          lng,
          displayName: geoObject.metaDataProperty.GeocoderMetaData.text,
          isInStPetersburg,
        };
      }
    } catch (yandexError) {
      console.warn(
        "Yandex Geocoder failed, falling back to Nominatim:",
        yandexError,
      );
    }

    // Fallback to Nominatim (OpenStreetMap)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=ru&addressdetails=1`;
    const nominatimResponse = await fetch(nominatimUrl);
    const nominatimData = await nominatimResponse.json();

    if (!nominatimData || nominatimData.length === 0) {
      return null;
    }

    const result = nominatimData[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    // Check if coordinates are within St. Petersburg bounds
    const isInStPetersburg = isWithinStPetersburg(lat, lng);

    return {
      lat,
      lng,
      displayName: result.display_name,
      isInStPetersburg,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Check if coordinates are within St. Petersburg city bounds
 */
export function isWithinStPetersburg(lat: number, lng: number): boolean {
  return (
    lat >= ST_PETERSBURG_BOUNDS.south &&
    lat <= ST_PETERSBURG_BOUNDS.north &&
    lng >= ST_PETERSBURG_BOUNDS.west &&
    lng <= ST_PETERSBURG_BOUNDS.east
  );
}

/**
 * Get random coordinates within St. Petersburg for demonstration
 */
export function getRandomStPetersburgCoordinates(): {
  lat: number;
  lng: number;
} {
  const latRange = ST_PETERSBURG_BOUNDS.north - ST_PETERSBURG_BOUNDS.south;
  const lngRange = ST_PETERSBURG_BOUNDS.east - ST_PETERSBURG_BOUNDS.west;

  return {
    lat: ST_PETERSBURG_BOUNDS.south + Math.random() * latRange,
    lng: ST_PETERSBURG_BOUNDS.west + Math.random() * lngRange,
  };
}

/**
 * Validate if an address string seems to be in St. Petersburg
 */
export function isStPetersburgAddress(address: string): boolean {
  const lowerAddress = address.toLowerCase();
  return (
    lowerAddress.includes("санкт-петербург") ||
    lowerAddress.includes("спб") ||
    lowerAddress.includes("питер") ||
    lowerAddress.includes("st petersburg") ||
    lowerAddress.includes("ленинградская область")
  );
}

/**
 * Format address for St. Petersburg
 */
export function formatStPetersburgAddress(address: string): string {
  const trimmedAddress = address.trim();

  if (isStPetersburgAddress(trimmedAddress)) {
    return trimmedAddress;
  }

  return `${trimmedAddress}, Санкт-Петербург, Россия`;
}
