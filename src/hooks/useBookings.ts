import { useState, useCallback, useEffect } from "react";
import { loadAppData } from "@/lib/dataStorage";

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  specialRequests?: string;
}

export interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
  specialRequests?: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadAppData();
    if (savedData && savedData.bookings.length > 0) {
      setBookings(savedData.bookings);
    }
  }, []);

  const createBooking = useCallback(
    async (
      propertyId: string,
      formData: BookingFormData,
      pricePerMonth: number,
    ): Promise<Booking> => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!formData.checkIn || !formData.checkOut) {
        throw new Error("Даты заезда и выезда обязательны");
      }

      // Calculate total price (simplified - just price per month)
      const months = Math.max(
        1,
        Math.ceil(
          (formData.checkOut.getTime() - formData.checkIn.getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        ),
      );
      const totalPrice = pricePerMonth * months;

      const booking: Booking = {
        id: `booking-${Date.now()}`,
        propertyId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        totalPrice,
        status: "pending",
        createdAt: new Date(),
        specialRequests: formData.specialRequests,
      };

      setBookings((prev) => [...prev, booking]);
      setLoading(false);

      return booking;
    },
    [],
  );

  const getBookingsForProperty = useCallback(
    (propertyId: string) => {
      return bookings.filter((booking) => booking.propertyId === propertyId);
    },
    [bookings],
  );

  const updateBookingStatus = useCallback(
    (bookingId: string, status: Booking["status"]) => {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking,
        ),
      );
    },
    [],
  );

  return {
    bookings,
    loading,
    createBooking,
    getBookingsForProperty,
    updateBookingStatus,
  };
}
