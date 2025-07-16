import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Check, AlertTriangle, FileText } from "lucide-react";
import { importDataFromFile } from "@/lib/dataStorage";
import { useToast } from "@/hooks/use-toast";

interface DataImportButtonProps {
  onDataImported?: () => void;
}

export function DataImportButton({ onDataImported }: DataImportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setImportedData(data);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось прочитать файл. Проверьте формат данных.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importedData) return;

    setIsImporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

      const result = importDataFromFile(importedData);

      if (result.success) {
        setSuccess(true);
        toast({
          title: "Успешно!",
          description: `Импортировано: ${result.imported.properties} объектов, ${result.imported.bookings} бронирований`,
        });

        setTimeout(() => {
          setIsDialogOpen(false);
          setSuccess(false);
          setImportedData(null);
          onDataImported?.();
        }, 2000);
      } else {
        toast({
          title: "Ошибка импорта",
          description: result.error || "Не удалось импортировать данные",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при импорте данных",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setImportedData(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        size="sm"
        className="border-green-200 text-green-700 hover:bg-green-50"
      >
        <Upload className="w-4 h-4 mr-2" />
        Импорт данных
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Импорт данных</DialogTitle>
            <DialogDescription>
              Загрузите файл данных для синхронизации между устройствами
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Info alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Для синхронизации:</strong> Экспортируйте данные на
                одном устройстве, затем импортируйте на другом устройстве.
              </AlertDescription>
            </Alert>

            {!importedData ? (
              /* File selection */
              <div className="space-y-4">
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 mb-3">
                    Выберите файл с данными для импорта
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                  >
                    Выбрать файл
                  </Button>
                </div>
              </div>
            ) : (
              /* Data preview and import */
              <div className="space-y-4">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h3 className="font-medium text-neutral-900 mb-3">
                    Данные для импорта:
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Объекты:</span>
                      <div className="font-medium">
                        {importedData.properties?.length || 0}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-600">Бронирования:</span>
                      <div className="font-medium">
                        {importedData.bookings?.length || 0}
                      </div>
                    </div>
                  </div>
                  {importedData.statistics && (
                    <div className="mt-2 text-sm">
                      <span className="text-neutral-600">Статистика:</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {importedData.statistics.length} записей
                      </Badge>
                    </div>
                  )}
                  {importedData.navigation && (
                    <div className="mt-2 text-sm">
                      <span className="text-neutral-600">Навигация:</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {importedData.navigation.length} страниц
                      </Badge>
                    </div>
                  )}
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700">
                    <strong>Внимание:</strong> Импорт заменит все текущие
                    данные. Рекомендуется сначала экспортировать текущие данные.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button
                    onClick={handleImport}
                    disabled={isImporting || success}
                    className={success ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isImporting ? (
                      <>
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                        Импорт...
                      </>
                    ) : success ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Готово!
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Импортировать
                      </>
                    )}
                  </Button>

                  <Button variant="outline" onClick={resetImport}>
                    Отмена
                  </Button>
                </div>
              </div>
            )}

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
