import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Database, X } from "lucide-react";
import { getLastSavedTime, hasSavedData } from "@/lib/dataStorage";

export function DataLoadingIndicator() {
  const [showNotification, setShowNotification] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    // Check if there's saved data on mount
    if (hasSavedData()) {
      const savedTime = getLastSavedTime();
      setLastSaved(savedTime);
      setShowNotification(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showNotification || !lastSaved) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className="border-green-200 bg-green-50 shadow-lg">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">
                <Database className="w-4 h-4 inline mr-1" />
                Данные загружены
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-green-600 hover:text-green-800 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
