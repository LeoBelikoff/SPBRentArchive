import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Eye,
  EyeOff,
  Key,
  User,
  Check,
  AlertTriangle,
} from "lucide-react";
import { AuthCredentials } from "@/hooks/useAuth";

interface CredentialsSettingsProps {
  currentCredentials: AuthCredentials;
  onUpdateCredentials: (credentials: AuthCredentials) => boolean;
  onCheckCurrentPassword: (password: string) => boolean;
  onLogout: () => void;
}

export function CredentialsSettings({
  currentCredentials,
  onUpdateCredentials,
  onCheckCurrentPassword,
  onLogout,
}: CredentialsSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(currentCredentials.username);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (): boolean => {
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Введите текущий пароль");
      return false;
    }

    if (!onCheckCurrentPassword(currentPassword)) {
      setError("Неверный текущий пароль");
      return false;
    }

    if (!newUsername.trim()) {
      setError("Новый логин не может быть пустым");
      return false;
    }

    if (newUsername.length < 3) {
      setError("Логин должен содержать минимум 3 символа");
      return false;
    }

    if (!newPassword) {
      setError("Введите новый пароль");
      return false;
    }

    if (newPassword.length < 4) {
      setError("Пароль должен содержать минимум 4 символа");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = onUpdateCredentials({
      username: newUsername,
      password: newPassword,
    });

    if (success) {
      setSuccess("Учетные данные успешно обновлены!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Auto logout after 3 seconds to re-login with new credentials
      setTimeout(() => {
        setSuccess("Перенаправление на страницу входа...");
        setTimeout(onLogout, 1000);
      }, 2000);
    } else {
      setError("Ошибка при обновлении учетных данных");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Изменение учетных данных
            </h3>
            <p className="text-neutral-600 text-sm">
              Обновите логин и пароль для входа в админ-панель
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password">Текущий пароль *</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Введите текущий пароль"
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                disabled={isLoading}
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Separator />

          {/* New Username */}
          <div className="space-y-2">
            <Label htmlFor="new-username">Новый логин *</Label>
            <div className="relative">
              <Input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Введите новый логин"
                disabled={isLoading}
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
            <p className="text-xs text-neutral-500">
              Минимум 3 символа, латинские буквы и цифры
            </p>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">Новый пароль *</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль"
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                disabled={isLoading}
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Подтвердите новый пароль *</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите новый пароль"
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                disabled={isLoading}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-orange hover:bg-brand-500"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Обновление...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                Сохранить изменения
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Current Info */}
      <Card className="p-6 bg-neutral-50">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-neutral-900 mb-1">
              Текущие учетные данные
            </h4>
            <p className="text-sm text-neutral-600">
              Логин:{" "}
              <code className="bg-neutral-200 px-1 rounded">
                {currentCredentials.username}
              </code>
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Выйти
          </Button>
        </div>
      </Card>
    </div>
  );
}
