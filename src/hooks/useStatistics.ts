import { useState, useCallback, useEffect } from "react";

export interface StatisticItem {
  id: string;
  value: string;
  label: string;
  order: number;
}

const STATISTICS_STORAGE_KEY = "apartment-rental-statistics";

const defaultStatistics: StatisticItem[] = [
  {
    id: "1",
    value: "247",
    label: "Довольных клиентов",
    order: 1,
  },
  {
    id: "2",
    value: "89",
    label: "Активных объектов",
    order: 2,
  },
  {
    id: "3",
    value: "12",
    label: "Районов города",
    order: 3,
  },
  {
    id: "4",
    value: "4.8",
    label: "Средняя оценка",
    order: 4,
  },
];

export function useStatistics() {
  const [statistics, setStatistics] =
    useState<StatisticItem[]>(defaultStatistics);
  const [loading, setLoading] = useState(false);

  // Load saved statistics on mount
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(STATISTICS_STORAGE_KEY);
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        setStatistics(parsedStats);
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  }, []);

  const saveStatistics = useCallback((newStatistics: StatisticItem[]) => {
    try {
      localStorage.setItem(
        STATISTICS_STORAGE_KEY,
        JSON.stringify(newStatistics),
      );
      setStatistics(newStatistics);
      return true;
    } catch (error) {
      console.error("Error saving statistics:", error);
      return false;
    }
  }, []);

  const updateStatistic = useCallback(
    (id: string, updates: Partial<StatisticItem>) => {
      const updatedStats = statistics.map((stat) =>
        stat.id === id ? { ...stat, ...updates } : stat,
      );
      return saveStatistics(updatedStats);
    },
    [statistics, saveStatistics],
  );

  const addStatistic = useCallback(
    (statistic: Omit<StatisticItem, "id">) => {
      const newStat: StatisticItem = {
        ...statistic,
        id: `stat-${Date.now()}`,
      };
      const updatedStats = [...statistics, newStat].sort(
        (a, b) => a.order - b.order,
      );
      return saveStatistics(updatedStats);
    },
    [statistics, saveStatistics],
  );

  const deleteStatistic = useCallback(
    (id: string) => {
      const updatedStats = statistics.filter((stat) => stat.id !== id);
      return saveStatistics(updatedStats);
    },
    [statistics, saveStatistics],
  );

  const reorderStatistics = useCallback(
    (reorderedStats: StatisticItem[]) => {
      const statsWithNewOrder = reorderedStats.map((stat, index) => ({
        ...stat,
        order: index + 1,
      }));
      return saveStatistics(statsWithNewOrder);
    },
    [saveStatistics],
  );

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STATISTICS_STORAGE_KEY);
    setStatistics(defaultStatistics);
    return true;
  }, []);

  return {
    statistics: statistics.sort((a, b) => a.order - b.order),
    loading,
    updateStatistic,
    addStatistic,
    deleteStatistic,
    reorderStatistics,
    resetToDefault,
    saveStatistics,
  };
}
