import React, { useEffect, useState } from "react";
import { api } from "../api/client";

type Booking = {
  id: number;
  name: string;
  email: string;
  start: string;
  end: string;
  status: string;
  eventType: { title: string };
};

type BookingsResponse = {
  upcoming: Booking[];
  past: Booking[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}
function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

const TABS = [
  { key: "upcoming",    label: "Upcoming" },
  { key: "unconfirmed", label: "Unconfirmed" },
  { key: "recurring",   label: "Recurring" },
  { key: "past",        label: "Past" },
  { key: "canceled",    label: "Canceled" },
] as const;

type TabKey = typeof TABS[number]["key"];

export function BookingsPage() {
  const [data, setData] = useState<BookingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");

  async function load() {
    setLoading(true);
    const result = await api.getBookings();
    setData(result);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const onCancel = async (id: number) => {
    if (!confirm("Cancel this booking?")) return;
    await api.cancelBooking(id);
    await load();
  };

  const upcoming  = data?.upcoming ?? [];
  const past      = data?.past ?? [];
  const canceled  = past.filter((b) => b.status === "CANCELLED");

  const getItems = (): Booking[] => {
    if (activeTab === "upcoming")    return upcoming;
    if (activeTab === "past")        return past;
    if (activeTab === "canceled")    return canceled;
    return [];
  };

  const items = getItems();

  return (
    <div className="bookings-page">

      {/* ── Header ── */}
      <div className="bookings-header">
        <div>
          <h2 className="bookings-title">Bookings</h2>
          <p className="bookings-subtitle">
            See upcoming and past meetings across all event types.
          </p>
        </div>
      </div>

      {/* ── Tabs + Saved filters ── */}
      <div className="bookings-tabs-bar">
        <div className="bookings-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`bookings-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button type="button" className="saved-filters-btn">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="2.5"/>
            <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"/>
          </svg>
          Saved filters
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="bookings-divider" />

      {/* ── Content ── */}
      <div className="bookings-content">
        {loading ? (
          <div className="bookings-loading">Loading…</div>
        ) : items.length === 0 ? (
          <div className="bookings-empty">
            <div className="bookings-empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <div className="bookings-empty-title">
              No {activeTab} bookings
            </div>
            <div className="bookings-empty-sub">
              Your {activeTab} bookings will show up here.
            </div>
          </div>
        ) : (
          <div className="bookings-list">
            {items.map((b) => (
              <div key={b.id} className="booking-row">
                {/* Date column */}
                <div className="booking-date-col">
                  <div className="booking-date">{formatDate(b.start)}</div>
                  <div className="booking-time">
                    {formatTime(b.start)} – {formatTime(b.end)}
                  </div>
                </div>

                {/* Info column */}
                <div className="booking-info">
                  <div className="booking-event-title">{b.eventType.title}</div>
                  <div className="booking-attendee">
                    {b.name}
                    <span className="booking-email">{b.email}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="booking-actions">
                  {b.status === "CONFIRMED" && activeTab === "upcoming" && (
                    <button
                      type="button"
                      className="booking-cancel-btn"
                      onClick={() => onCancel(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                  {activeTab !== "upcoming" && (
                    <span className={`booking-status-badge ${b.status === "CANCELLED" ? "cancelled" : "completed"}`}>
                      {b.status === "CANCELLED" ? "Cancelled" : "Completed"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}