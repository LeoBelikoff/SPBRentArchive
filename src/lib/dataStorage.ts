// Data persistence utility for saving and loading application data
import { Property } from "@/hooks/useProperties";
import { Booking } from "@/hooks/useBookings";

export interface AppData {
  properties: Property[];
  bookings: Booking[];
  lastSaved: string;
}

const STORAGE_KEY = "apartment-rental-hub-data";

/**
 * Save application data to localStorage
 */
export function saveAppData(
  properties: Property[],
  bookings: Booking[],
): boolean {
  try {
    const appData: AppData = {
      properties,
      bookings: bookings.map((booking) => ({
        ...booking,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      })) as any,
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    return true;
  } catch (error) {
    console.error("Ош��бка при сохранении данных:", error);
    return false;
  }
}

/**
 * Load application data from localStorage
 */
export function loadAppData(): AppData | null {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;

    const appData: AppData = JSON.parse(storedData);

    // Convert date strings back to Date objects for bookings
    const bookingsWithDates = appData.bookings.map((booking) => ({
      ...booking,
      checkIn: new Date(booking.checkIn as any),
      checkOut: new Date(booking.checkOut as any),
      createdAt: new Date(booking.createdAt as any),
    }));

    return {
      ...appData,
      bookings: bookingsWithDates,
    };
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    return null;
  }
}

/**
 * Check if there is saved data
 */
export function hasSavedData(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Clear all saved data
 */
export function clearSavedData(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Ошибка при очистке данных:", error);
    return false;
  }
}

/**
 * Get last saved timestamp
 */
export function getLastSavedTime(): Date | null {
  try {
    const appData = loadAppData();
    return appData ? new Date(appData.lastSaved) : null;
  } catch (error) {
    console.error("Ошибка при получении времени сохранения:", error);
    return null;
  }
}

/**
 * Export data to JSON file for backup
 */
export function exportDataToFile(
  properties: Property[],
  bookings: Booking[],
): void {
  try {
    // Include all data types for complete backup
    const statistics = localStorage.getItem("apartment-rental-statistics");
    const navigation = localStorage.getItem("apartment-rental-navigation");

    const exportData = {
      properties,
      bookings: bookings.map((booking) => ({
        ...booking,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      })) as any,
      statistics: statistics ? JSON.parse(statistics) : null,
      navigation: navigation ? JSON.parse(navigation) : null,
      lastSaved: new Date().toISOString(),
      exportVersion: "1.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `apartment-rental-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Ошибка при экспорте данных:", error);
  }
}

/**
 * Import data from file for synchronization between devices
 */
export function importDataFromFile(importedData: any): {
  success: boolean;
  error?: string;
  imported: {
    properties: number;
    bookings: number;
    statistics: number;
    navigation: number;
  };
} {
  try {
    // Validate data structure
    if (!importedData || typeof importedData !== "object") {
      return {
        success: false,
        error: "Неверный формат файла",
        imported: { properties: 0, bookings: 0, statistics: 0, navigation: 0 },
      };
    }

    let importCount = {
      properties: 0,
      bookings: 0,
      statistics: 0,
      navigation: 0,
    };

    // Import properties and bookings (main data)
    if (importedData.properties && importedData.bookings) {
      const appData: AppData = {
        properties: importedData.properties,
        bookings: importedData.bookings.map((booking: any) => ({
          ...booking,
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
          createdAt: new Date(booking.createdAt),
        })),
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
      importCount.properties = importedData.properties.length;
      importCount.bookings = importedData.bookings.length;
    }

    // Import statistics if available
    if (importedData.statistics) {
      localStorage.setItem(
        "apartment-rental-statistics",
        JSON.stringify(importedData.statistics),
      );
      importCount.statistics = importedData.statistics.length;
    }

    // Import navigation if available
    if (importedData.navigation) {
      localStorage.setItem(
        "apartment-rental-navigation",
        JSON.stringify(importedData.navigation),
      );
      importCount.navigation = importedData.navigation.length;
    }

    return {
      success: true,
      imported: importCount,
    };
  } catch (error) {
    console.error("Ошибка при импорте данных:", error);
    return {
      success: false,
      error: "Ошибка при обработке файла",
      imported: { properties: 0, bookings: 0, statistics: 0, navigation: 0 },
    };
  }
}
