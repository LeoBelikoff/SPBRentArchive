import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, RotateCcw, FileText, MessageCircle, Eye } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { useToast } from "@/hooks/use-toast";

export function NavigationEditor() {
  const {
    navigationPages,
    updateNavigationPage,
    saveNavigationPages,
    resetToDefaults,
  } = useNavigation();

  const { toast } = useToast();
  const [success, setSuccess] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleSave = () => {
    saveNavigationPages();
    setSuccess("Навигационные страницы сохранены!");
    toast({
      title: "Сохранено",
      description: "Изменения навигационных страниц успешно сохранены",
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleReset = () => {
    resetToDefaults();
    setSuccess("Навигационные страницы сброшены к значениям по умолчанию!");
    toast({
      title: "Сброшено",
      description: "Навигационные страницы восстановлены к исходному состоянию",
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  const getIcon = (pageId: string) => {
    switch (pageId) {
      case "details":
        return <FileText className="w-4 h-4" />;
      case "contacts":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const renderContentPreview = (content: string) => {
    return content
      .split("\n")
      .slice(0, 5)
      .map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h4 key={index} className="font-semibold text-neutral-900 mb-2">
              {line.substring(2)}
            </h4>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h5 key={index} className="font-medium text-neutral-800 mb-1">
              {line.substring(3)}
            </h5>
          );
        }
        if (line.trim() === "") {
          return <div key={index} className="mb-1" />;
        }
        return (
          <p key={index} className="text-sm text-neutral-600 mb-1">
            {line.length > 80 ? line.substring(0, 80) + "..." : line}
          </p>
        );
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Редактор навигационных страниц
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Управляйте содержимым страниц "Детали" и "Контакты"
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Сохранить изменения
          </Button>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {navigationPages
          .filter((page) => page.isEditable)
          .map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getIcon(page.id)}
                  Страница "{page.title}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setPreviewId(previewId === page.id ? null : page.id)
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-neutral-700">
                      Заголовок страницы
                    </Label>
                    <Input
                      value={page.title}
                      onChange={(e) =>
                        updateNavigationPage(page.id, { title: e.target.value })
                      }
                      placeholder="Введите заголовок"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-neutral-700">
                      Содержимое страницы
                    </Label>
                    <p className="text-xs text-neutral-500 mb-2">
                      Поддерживается простая разметка: # для заголовков, ## для
                      подзаголовков, **текст** для выделения, - для списков
                    </p>
                    <Textarea
                      value={page.content}
                      onChange={(e) =>
                        updateNavigationPage(page.id, {
                          content: e.target.value,
                        })
                      }
                      placeholder="Введите содержимое страницы"
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </div>
                </div>

                {previewId === page.id && (
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium text-neutral-700 mb-2 block">
                      Предварительный просмотр
                    </Label>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                      {renderContentPreview(page.content)}
                      {page.content.split("\n").length > 5 && (
                        <p className="text-xs text-neutral-400 mt-2">
                          ... и еще {page.content.split("\n").length - 5} строк
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">
          💡 Советы по форматированию:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Используйте # для главных заголовков</li>
          <li>• Используйте ## для подзаголовков</li>
          <li>• Используйте ### для мелких заголовков</li>
          <li>• Используйте **текст** для выделения жирным</li>
          <li>• Используйте - для маркированных списков</li>
          <li>• Оставляйте пустые строки между абзацами</li>
        </ul>
      </div>
    </div>
  );
}
