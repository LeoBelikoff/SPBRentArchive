import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  BarChart3,
  Save,
  RotateCcw,
  Check,
} from "lucide-react";
import { StatisticItem, useStatistics } from "@/hooks/useStatistics";

export function StatisticsEditor() {
  const {
    statistics,
    updateStatistic,
    addStatistic,
    deleteStatistic,
    resetToDefault,
  } = useStatistics();

  const [editingItem, setEditingItem] = useState<StatisticItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [success, setSuccess] = useState("");

  const handleEdit = (item: StatisticItem) => {
    setEditingItem(item);
    setIsNewItem(false);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem({
      id: "",
      value: "",
      label: "",
      order: statistics.length + 1,
    });
    setIsNewItem(true);
    setIsModalOpen(true);
  };

  const handleSave = (item: StatisticItem) => {
    let success = false;

    if (isNewItem) {
      success = addStatistic({
        value: item.value,
        label: item.label,
        order: item.order,
      });
    } else {
      success = updateStatistic(item.id, {
        value: item.value,
        label: item.label,
      });
    }

    if (success) {
      setSuccess(isNewItem ? "Показатель добавлен!" : "Показатель обновлен!");
      setIsModalOpen(false);
      setEditingItem(null);

      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот показатель?")) {
      const success = deleteStatistic(id);
      if (success) {
        setSuccess("Показатель удален!");
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Вы уверены, что хотите сбросить статистику к значениям по умолчанию?",
      )
    ) {
      resetToDefault();
      setSuccess("Статистика сброшена к значениям по умолчанию!");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Редактирование статистики
              </h3>
              <p className="text-neutral-600 text-sm">
                Управляйте показателями в разделе "Наша статистика"
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              className="bg-brand-orange hover:bg-brand-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="text-neutral-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Сбросить
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics List */}
        <div className="space-y-3">
          {statistics.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50"
            >
              <div className="cursor-move text-neutral-400">
                <GripVertical className="w-5 h-5" />
              </div>

              <Badge variant="secondary" className="text-xs min-w-[2rem]">
                {index + 1}
              </Badge>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-600">Значение</div>
                  <div className="text-lg font-bold text-brand-orange">
                    {item.value}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Описание</div>
                  <div className="text-neutral-900">{item.label}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {statistics.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <p>Нет показателей для отображения</p>
              <p className="text-sm mt-1">
                Добавьте первый показатель статистики
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6">
        <h4 className="font-semibold text-neutral-900 mb-4">
          Предварительный просмотр
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statistics.map((item) => (
            <div key={item.id} className="text-center">
              <div className="text-2xl font-bold text-brand-orange mb-2">
                {item.value}
              </div>
              <div className="text-neutral-600 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {isNewItem ? "Добавить показатель" : "Редактировать показатель"}
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <StatisticEditForm
              item={editingItem}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface StatisticEditFormProps {
  item: StatisticItem;
  onSave: (item: StatisticItem) => void;
  onCancel: () => void;
}

function StatisticEditForm({ item, onSave, onCancel }: StatisticEditFormProps) {
  const [formData, setFormData] = useState(item);
  const [errors, setErrors] = useState<Partial<StatisticItem>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<StatisticItem> = {};

    if (!formData.value.trim()) {
      newErrors.value = "Значение обязательно";
    }

    if (!formData.label.trim()) {
      newErrors.label = "Описание обязательно";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="value">Значение *</Label>
        <Input
          id="value"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder="247, 4.8, 150+"
          className={errors.value ? "border-red-500" : ""}
        />
        {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Описание *</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="Довольных клиентов"
          className={errors.label ? "border-red-500" : ""}
        />
        {errors.label && <p className="text-red-500 text-sm">{errors.label}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-brand-orange hover:bg-brand-500"
        >
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
      </div>
    </form>
  );
}
