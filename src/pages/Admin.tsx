import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CredentialsSettings } from "@/components/CredentialsSettings";
import { StatisticsEditor } from "@/components/StatisticsEditor";
import { NavigationEditor } from "@/components/NavigationEditor";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyEditModal, Property } from "@/components/PropertyEditModal";
import { SaveChangesButton } from "@/components/SaveChangesButton";
import { DataImportButton } from "@/components/DataImportButton";
import { useProperties } from "@/hooks/useProperties";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  Home,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
} from "lucide-react";

const AdminContent = () => {
  const { properties, addProperty, updateProperty, deleteProperty } =
    useProperties();
  const { bookings } = useBookings();
  const { credentials, logout, updateCredentials, checkCurrentPassword } =
    useAuth();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isNewProperty, setIsNewProperty] = useState(false);

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsNewProperty(false);
    setIsPropertyModalOpen(true);
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsNewProperty(true);
    setIsPropertyModalOpen(true);
  };

  const handleSaveProperty = (property: Property) => {
    if (isNewProperty) {
      addProperty(property);
    } else {
      updateProperty(property);
    }
    setIsPropertyModalOpen(false);
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm("Вы уверены, что хотите удалить этот объект?")) {
      deleteProperty(propertyId);
    }
  };

  const handleDataCleared = () => {
    // Force page reload to reset all data to initial state
    window.location.reload();
  };

  // Calculate statistics
  const totalRevenue = properties.reduce((sum, property) => {
    if (property.status === "booked") {
      return sum + property.price;
    }
    return sum;
  }, 0);

  const availableCount = properties.filter(
    (p) => p.status === "available",
  ).length;
  const bookedCount = properties.filter((p) => p.status === "booked").length;
  return (
    <div className="min-h-screen bg-page-bg">
      <Header />

      <main className="max-w-8xl mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Панель Администратора
              </h1>
              <p className="text-neutral-600">
                Управление объектами недвижимости и системой аренды
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Всего объектов
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {properties.length}
                </p>
              </div>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Активные аренды
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {bookedCount}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">
                  Доход в месяц
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  ₽{totalRevenue.toLocaleString("ru-RU")}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">
                  Заявки на бронирование
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {bookings.length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Объекты
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Бронирования
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Навигация
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Управление объектами
                  </h2>
                  <div className="text-neutral-600 space-y-1">
                    <p>Добавляйте, редактируйте и управляйте</p>
                    <p>объектами недвижимости</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <DataImportButton
                    onDataImported={() => window.location.reload()}
                  />
                  <SaveChangesButton
                    properties={properties}
                    bookings={bookings}
                    onDataCleared={handleDataCleared}
                  />
                  <Button
                    onClick={handleAddProperty}
                    className="bg-brand-orange hover:bg-brand-500 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить объект
                  </Button>
                </div>
              </div>
            </div>

            <Card>
              <div className="p-6">
                <div className="space-y-4">
                  {properties.map((property) => {
                    const statusColors = {
                      available: "bg-status-available",
                      limited: "bg-status-limited",
                      booked: "bg-status-booked",
                    };

                    const statusLabels = {
                      available: "Доступно",
                      limited: "Ограничено",
                      booked: "Забронировано",
                    };

                    return (
                      <div
                        key={property.id}
                        className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-neutral-900">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-neutral-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Особые пожелания:
                              </span>
                              <span>
                                ₽{property.price.toLocaleString("ru-RU")}/мес
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${statusColors[property.status]} text-white`}
                          >
                            {statusLabels[property.status]}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {properties.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      Нет объектов для отображения
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab - Now showing bookings */}
          <TabsContent value="users" className="space-y-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Управление бронированиями
                    </h2>
                    <Badge variant="secondary" className="text-sm">
                      Всего: {bookings.length}
                    </Badge>
                  </div>
                  <div className="text-neutral-600 space-y-1">
                    <p>Просматривайте и управляйте заявками</p>
                    <p>на бронирование</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <DataImportButton
                    onDataImported={() => window.location.reload()}
                  />
                  <SaveChangesButton
                    properties={properties}
                    bookings={bookings}
                    onDataCleared={handleDataCleared}
                  />
                </div>
              </div>
            </div>

            <Card>
              <div className="p-6">
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const property = properties.find(
                        (p) => p.id === booking.propertyId,
                      );
                      const statusColors = {
                        pending: "bg-yellow-100 text-yellow-800",
                        confirmed: "bg-green-100 text-green-800",
                        cancelled: "bg-red-100 text-red-800",
                      };

                      const statusLabels = {
                        pending: "Ожидает",
                        confirmed: "Подтверждено",
                        cancelled: "Отменено",
                      };

                      return (
                        <div
                          key={booking.id}
                          className="border border-neutral-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-neutral-900">
                                {booking.guestName}
                              </h3>
                              <p className="text-sm text-neutral-600">
                                {property?.title || "Неизве��т��ы�� объект"}
                              </p>
                            </div>
                            <Badge className={statusColors[booking.status]}>
                              {statusLabels[booking.status]}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-neutral-500">Email:</span>
                              <br />
                              <span className="text-neutral-900">
                                {booking.guestEmail}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-500">Телефон:</span>
                              <br />
                              <span className="text-neutral-900">
                                {booking.guestPhone}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-500">Период:</span>
                              <br />
                              <span className="text-neutral-900">
                                {booking.checkIn.toLocaleDateString("ru-RU")} -{" "}
                                {booking.checkOut.toLocaleDateString("ru-RU")}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-500">Сумма:</span>
                              <br />
                              <span className="text-neutral-900 font-medium">
                                ₽{booking.totalPrice.toLocaleString("ru-RU")}
                              </span>
                            </div>
                          </div>

                          {booking.specialRequests && (
                            <div className="mt-3 text-sm">
                              <span className="text-neutral-500">
                                Особые пожелания:
                              </span>
                              <p className="text-neutral-700 mt-1">
                                {booking.specialRequests}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2 mt-4">
                            {booking.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Подтвердить
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Отклонить
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4 mr-1" />
                              Подробнее
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                    <p>Пока нет бронирований</p>
                    <p className="text-sm mt-1">
                      Когда пользователи начнут бронировать квартиры, они
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Редактирование навигации
                  </h2>
                  <div className="text-neutral-600 space-y-1">
                    <p>Настройте содержимое страниц</p>
                    <p>"Детали" и "Контакты"</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <DataImportButton
                    onDataImported={() => window.location.reload()}
                  />
                  <SaveChangesButton
                    properties={properties}
                    bookings={bookings}
                    onDataCleared={handleDataCleared}
                  />
                </div>
              </div>
            </div>

            <NavigationEditor />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Аналитика и статистика
                  </h2>
                  <div className="text-neutral-600 space-y-1">
                    <p>��правляйте статистическими данными</p>
                    <p>и аналитикой сайта</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <DataImportButton
                    onDataImported={() => window.location.reload()}
                  />
                  <SaveChangesButton
                    properties={properties}
                    bookings={bookings}
                    onDataCleared={handleDataCleared}
                  />
                </div>
              </div>
            </div>

            <StatisticsEditor />

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Дополнительная аналитика
              </h3>
              <p className="text-neutral-600">
                В этом разделе в будущем будут представлены графики занятости,
                доходов, популярных объектов и другой важной статистики.
              </p>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Настройки системы
                  </h2>
                  <div className="text-neutral-600 space-y-1">
                    <p>Управляйте настройками доступа</p>
                    <p>и конфигурацией системы</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <DataImportButton
                    onDataImported={() => window.location.reload()}
                  />
                  <SaveChangesButton
                    properties={properties}
                    bookings={bookings}
                    onDataCleared={handleDataCleared}
                  />
                </div>
              </div>
            </div>

            <CredentialsSettings
              currentCredentials={credentials}
              onUpdateCredentials={updateCredentials}
              onCheckCurrentPassword={checkCurrentPassword}
              onLogout={logout}
            />

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Дополнительные настройки
              </h3>
              <p className="text-neutral-600">
                Конфигурация системы, настройки уведомлений, интеграции с
                внешними сервисами и другие административные параметры.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Property Edit Modal */}
      <PropertyEditModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        property={editingProperty}
        onSave={handleSaveProperty}
        isNew={isNewProperty}
      />
    </div>
  );
};

const Admin = () => {
  return (
    <ProtectedAdminRoute>
      <AdminContent />
    </ProtectedAdminRoute>
  );
};

export default Admin;
