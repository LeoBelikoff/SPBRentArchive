import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookings, BookingFormData } from "@/hooks/useBookings";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: string;
  title: string;
  price: number;
  area: number;
  bedrooms: number | string;
  bathrooms: number | string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export function BookingModal({ isOpen, onClose, property }: BookingModalProps) {
  const { createBooking, loading } = useBookings();
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [bookingData, setBookingData] = useState<BookingFormData>({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkIn: undefined,
    checkOut: undefined,
    guests: 1,
    specialRequests: "",
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!bookingData.guestName.trim()) {
      newErrors.guestName = "Имя обязательно";
    }

    if (!bookingData.guestEmail.trim()) {
      newErrors.guestEmail = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.guestEmail)) {
      newErrors.guestEmail = "Некорректный email";
    }

    if (!bookingData.guestPhone.trim()) {
      newErrors.guestPhone = "Телефон обязателен";
    }

    if (!bookingData.checkIn) {
      newErrors.checkIn = "Дата заезда обязательна" as any;
    }

    if (!bookingData.checkOut) {
      newErrors.checkOut = "Дата выезда обязательна" as any;
    }

    if (
      bookingData.checkIn &&
      bookingData.checkOut &&
      bookingData.checkIn >= bookingData.checkOut
    ) {
      newErrors.checkOut = "Дата выезда должна быть позже даты заезда" as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property || !validateForm()) return;

    try {
      await createBooking(property.id, bookingData, property.price);
      setStep("confirmation");
    } catch (error) {
      console.error("Ошибка при создании бронирования:", error);
    }
  };

  const handleClose = () => {
    setStep("form");
    setBookingData({
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      checkIn: undefined,
      checkOut: undefined,
      guests: 1,
      specialRequests: "",
    });
    setErrors({});
    onClose();
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-neutral-900">
                Бронирование квартиры
              </DialogTitle>
              <DialogDescription>
                Заполните форму для бронирования "{property.title}"
              </DialogDescription>
            </DialogHeader>

            {/* Property Summary */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-neutral-900 mb-2">
                {property.title}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
                <div>Площадь: {property.area} кв.м</div>
                <div>Спальни: {property.bedrooms}</div>
                <div>Ванные: {property.bathrooms}</div>
                <div className="font-semibold text-brand-orange">
                  {property.price.toLocaleString("ru-RU")} ₽/мес
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Личная информация
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Полное имя *</Label>
                    <Input
                      id="guestName"
                      value={bookingData.guestName}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          guestName: e.target.value,
                        })
                      }
                      className={errors.guestName ? "border-red-500" : ""}
                    />
                    {errors.guestName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guestPhone">Телефон *</Label>
                    <Input
                      id="guestPhone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={bookingData.guestPhone}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          guestPhone: e.target.value,
                        })
                      }
                      className={errors.guestPhone ? "border-red-500" : ""}
                    />
                    {errors.guestPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guestPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="guestEmail">Email *</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={bookingData.guestEmail}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        guestEmail: e.target.value,
                      })
                    }
                    className={errors.guestEmail ? "border-red-500" : ""}
                  />
                  {errors.guestEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.guestEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Детали бронирования
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Дата заезда *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingData.checkIn && "text-muted-foreground",
                            errors.checkIn && "border-red-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingData.checkIn ? (
                            format(bookingData.checkIn, "PPP", { locale: ru })
                          ) : (
                            <span>Выберите дату</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookingData.checkIn}
                          onSelect={(date) =>
                            setBookingData({ ...bookingData, checkIn: date })
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.checkIn && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.checkIn}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Дата выезда *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingData.checkOut && "text-muted-foreground",
                            errors.checkOut && "border-red-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingData.checkOut ? (
                            format(bookingData.checkOut, "PPP", { locale: ru })
                          ) : (
                            <span>Выберите дату</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookingData.checkOut}
                          onSelect={(date) =>
                            setBookingData({ ...bookingData, checkOut: date })
                          }
                          disabled={(date) =>
                            date <= (bookingData.checkIn || new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.checkOut && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.checkOut}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Количество гостей</Label>
                  <Select
                    value={bookingData.guests.toString()}
                    onValueChange={(value) =>
                      setBookingData({
                        ...bookingData,
                        guests: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}{" "}
                          {num === 1 ? "гость" : num < 5 ? "гостя" : "гостей"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialRequests">
                    Особые пожелания (необязательно)
                  </Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Укажите любые особые пожелания или требования..."
                    value={bookingData.specialRequests}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        specialRequests: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-orange hover:bg-brand-500"
                >
                  {loading ? "Обработка..." : "Забронировать"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-green-600">
                🎉 Бронирование создано!
              </DialogTitle>
              <DialogDescription>
                Ваша заявка на бронирование успешно отправлена
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  Детали бронирования:
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div>Квартира: {property.title}</div>
                  <div>Гость: {bookingData.guestName}</div>
                  <div>Email: {bookingData.guestEmail}</div>
                  <div>Телефон: {bookingData.guestPhone}</div>
                  {bookingData.checkIn && (
                    <div>
                      Заезд:{" "}
                      {format(bookingData.checkIn, "PPP", { locale: ru })}
                    </div>
                  )}
                  {bookingData.checkOut && (
                    <div>
                      Выезд:{" "}
                      {format(bookingData.checkOut, "PPP", { locale: ru })}
                    </div>
                  )}
                  <div>Гостей: {bookingData.guests}</div>
                </div>
                <Badge className="mt-3 bg-yellow-100 text-yellow-800">
                  Статус: Ожидает подтверждения
                </Badge>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Что дальше?
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Мы свяжемся с вами в течение 2 часов</li>
                  <li>• Подтвердим детали бронирования</li>
                  <li>• Отправим договор аренды на email</li>
                  <li>• Назначим время для осмотра квартиры</li>
                </ul>
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-brand-orange hover:bg-brand-500"
              >
                Закрыть
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
