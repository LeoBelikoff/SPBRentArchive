import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Save,
  Check,
  Download,
  RotateCcw,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  saveAppData,
  getLastSavedTime,
  exportDataToFile,
  clearSavedData,
} from "@/lib/dataStorage";
import { Property } from "@/hooks/useProperties";
import { Booking } from "@/hooks/useBookings";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SaveChangesButtonProps {
  properties: Property[];
  bookings: Booking[];
  onDataCleared?: () => void;
}

export function SaveChangesButton({
  properties,
  bookings,
  onDataCleared,
}: SaveChangesButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(getLastSavedTime());

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate async operation for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      const success = saveAppData(properties, bookings);

      if (success) {
        setJustSaved(true);
        setLastSaved(new Date());

        // Reset the "just saved" state after 3 seconds
        setTimeout(() => {
          setJustSaved(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    exportDataToFile(properties, bookings);
  };

  const handleClearData = () => {
    const success = clearSavedData();
    if (success) {
      setLastSaved(null);
      setIsDialogOpen(false);
      onDataCleared?.();
    }
  };

  const totalItems = properties.length + bookings.length;

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Last saved indicator */}
        {lastSaved && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>
              Сохранено:{" "}
              {lastSaved.toLocaleString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Main save button */}
        <Button
          onClick={handleSave}
          disabled={isSaving || justSaved}
          className={`min-w-[160px] transition-all duration-300 ${
            justSaved
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          size="sm"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Сохранение...
            </>
          ) : justSaved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Сохранено!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Сохранить изменения
            </>
          )}
        </Button>

        {/* Data count badge */}
        <Badge variant="secondary" className="text-xs">
          {totalItems} записей
        </Badge>

        {/* More options button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="px-3"
        >
          ⋯
        </Button>
      </div>

      {/* More options dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Управление данными</DialogTitle>
            <DialogDescription>
              Дополнительные опции для работы с данными приложения
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current data info */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="font-medium text-neutral-900 mb-3">
                Текущие данные:
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Объекты:</span>
                  <div className="font-medium">{properties.length}</div>
                </div>
                <div>
                  <span className="text-neutral-600">Бронирования:</span>
                  <div className="font-medium">{bookings.length}</div>
                </div>
              </div>
              {lastSaved && (
                <div className="mt-3 text-xs text-neutral-500">
                  Последнее сохранение: {lastSaved.toLocaleString("ru-RU")}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт данных в файл
              </Button>

              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  <strong>Сброс данных:</strong> Удалит все объекты и
                  бронирования, вернув к исходному состоянию.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleClearData}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Сбросить все данные
              </Button>
            </div>

            <div className="pt-3">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="ghost"
                className="w-full"
              >
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
