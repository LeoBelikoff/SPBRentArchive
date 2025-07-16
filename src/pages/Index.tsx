import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { PropertyCard } from "@/components/PropertyCard";
import { MapSidebar } from "@/components/MapSidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { useProperties } from "@/hooks/useProperties";
import { useStatistics } from "@/hooks/useStatistics";

const Index = () => {
  const { properties } = useProperties();
  const { statistics } = useStatistics();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleViewDetails = (id: string) => {
    console.log("Viewing details for property:", id);
    // Here you would typically navigate to a details page
    // For now, let's scroll to the property or show more info
    setSelectedPropertyId(id);
  };

  const handleCheckAvailability = (id: string) => {
    setSelectedPropertyId(id);
    setIsBookingModalOpen(true);
  };

  const handlePropertySelectFromMap = (propertyId: string) => {
    // Scroll to property card
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setSelectedPropertyId(propertyId);

      // Highlight the property briefly
      element.style.transform = "scale(1.02)";
      element.style.transition = "transform 0.3s ease";
      setTimeout(() => {
        element.style.transform = "scale(1)";
      }, 1000);
    }
  };

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <div className="min-h-screen bg-page-bg">
      <Header />

      <main className="max-w-8xl mx-auto px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem className="text-neutral-600">
              Витрина Объектов
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            Откройте Вашу Идеальную Аренду
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed">
            Исследуйте нашу кураторскую коллекцию премиальных квартир с
            интерактивными картами, подробными галереями и календарями
            доступности в реальном времени.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map Sidebar */}
          <div className="lg:col-span-4">
            <MapSidebar
              properties={properties}
              onPropertySelect={handlePropertySelectFromMap}
            />
          </div>

          {/* Property Listings */}
          <div className="lg:col-span-8">
            <div className="space-y-8">
              {properties.map((property) => (
                <div
                  key={property.id}
                  id={`property-${property.id}`}
                  className={
                    selectedPropertyId === property.id
                      ? "ring-2 ring-brand-orange ring-opacity-50 rounded-lg"
                      : ""
                  }
                >
                  <PropertyCard
                    {...property}
                    onViewDetails={handleViewDetails}
                    onCheckAvailability={handleCheckAvailability}
                  />
                </div>
              ))}
            </div>

            {/* Properties Summary */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 bg-white rounded-lg px-6 py-4 shadow-sm border border-neutral-200">
                <div className="text-neutral-600">
                  Показано {properties.length} объект
                  {properties.length === 1
                    ? ""
                    : properties.length < 5
                      ? "а"
                      : "ов"}
                </div>
                {properties.length > 0 && (
                  <div className="text-sm text-neutral-500">
                    Всего доступно для аренды
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm border border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
            Наша Статистика
          </h2>
          <div
            className={`grid gap-8 ${
              statistics.length === 4
                ? "grid-cols-1 md:grid-cols-4"
                : statistics.length === 3
                  ? "grid-cols-1 md:grid-cols-3"
                  : statistics.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1"
            }`}
          >
            {statistics.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-3xl font-bold text-brand-orange mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {statistics.length === 0 && (
            <div className="text-center text-neutral-500">
              <p>Статистика не настроена</p>
              <p className="text-sm mt-1">
                Обратитесь к администратору для настройки
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        property={selectedProperty || null}
      />
    </div>
  );
};

export default Index;
