import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { EventTypesPage } from "./pages/EventTypesPage";
import { AvailabilityPage } from "./pages/AvailabilityPage";
import { BookingsPage } from "./pages/BookingsPage";
import { PublicBookingPage } from "./pages/PublicBookingPage";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";

export default function App() {
  return (
    <Routes>
      {/* Event Types: has its OWN topbar (title + search + New button) */}
      <Route
        path="/"
        element={
          <DashboardLayout hideTopbar>
            <EventTypesPage />
          </DashboardLayout>
        }
      />

      {/* Availability: has its OWN topbar (back, name, save) */}
      <Route
        path="/availability"
        element={
          <DashboardLayout hideTopbar>
            <AvailabilityPage />
          </DashboardLayout>
        }
      />

      {/* Bookings: has its OWN header + tabs bar */}
      <Route
        path="/bookings"
        element={
          <DashboardLayout hideTopbar>
            <BookingsPage />
          </DashboardLayout>
        }
      />

      <Route path="/book/:slug" element={<PublicBookingPage />} />
      <Route path="/confirm" element={<BookingConfirmationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}