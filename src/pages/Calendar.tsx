import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { useBookings } from "@/hooks/useBookings";
import { useState } from "react";

export default function Calendar() {
  const { properties } = useProperties();
  const { bookings } = useBookings();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Simulate calendar data based on property status
  const getAvailabilityData = () => {
    const available = properties.filter((p) => p.status === "available").length;
    const limited = properties.filter((p) => p.status === "limited").length;
    const booked = properties.filter((p) => p.status === "booked").length;

    return { available, limited, booked };
  };

  const availabilityData = getAvailabilityData();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-neutral-200">
          <div className="max-w-8xl mx-auto px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                Календарь доступности
              </h1>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Планируйте аренду заранее! Проверяйте доступность квартир на
                нужные вам даты и бронируйте жилье в удобное время.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="max-w-8xl mx-auto px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
              Текущая доступность
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {availabilityData.available}
                </div>
                <div className="text-sm text-green-600">Доступно</div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-yellow-700 mb-1">
                  {availabilityData.limited}
                </div>
                <div className="text-sm text-yellow-600">Ограничено</div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <CalendarIcon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-red-700 mb-1">
                  {availabilityData.booked}
                </div>
                <div className="text-sm text-red-600">Забронировано</div>
              </div>
            </div>

            {/* Available Properties */}
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Доступные квартиры ({availabilityData.available})
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {properties
                  .filter((property) => property.status === "available")
                  .map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      price={property.price}
                      bedrooms={property.bedrooms}
                      bathrooms={property.bathrooms}
                      area={property.area}
                      status={property.status}
                      images={property.images}
                      amenities={property.amenities}
                    />
                  ))}
              </div>

              {availabilityData.available === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-500 mb-2">
                    Нет доступных квартир
                  </h3>
                  <p className="text-neutral-400">
                    В данный момент все квартиры забронированы или имеют
                    ограничения
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Calendar Tips */}
        <section className="py-16 bg-neutral-50">
          <div className="max-w-8xl mx-auto px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
              Полезные советы
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  📅 Планируйте заранее
                </h3>
                <p className="text-neutral-600 text-sm">
                  Бронируйте квартиры минимум за 3-7 дней до заселения. В
                  высокий сезон лучше планировать за 2-3 недели.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  ⏰ Гибкие даты
                </h3>
                <p className="text-neutral-600 text-sm">
                  Если ваши даты гибкие, выберите несколько вариантов. Это
                  увеличит шансы найти идеальную квартиру.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  🔄 Проверяйте обновления
                </h3>
                <p className="text-neutral-600 text-sm">
                  Статус квартир обновляется в реальном времени. Проверяйте
                  доступность регулярно.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  📞 Связывайтесь с нами
                </h3>
                <p className="text-neutral-600 text-sm">
                  Если нужной даты нет в календаре, свяжитесь с нами. Возможно,
                  мы сможем предложить альтернативы.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
