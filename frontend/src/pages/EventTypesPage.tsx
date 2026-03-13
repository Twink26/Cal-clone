import React, { useEffect, useState } from "react";
import { api } from "../api/client";

type EventType = {
  id: number;
  title: string;
  description?: string | null;
  duration: number;
  slug: string;
  enabled?: boolean;
};

const emptyForm = {
  title: "",
  description: "",
  duration: 15,
  slug: "",
};

// ── Icons ──────────────────────────────────────────────────────────
const IconExternal = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9" />
    <path d="M10 1h5v5M15 1L8 8" />
  </svg>
);

const IconLink = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7 4" />
    <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5L9 12" />
  </svg>
);

const IconDots = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="3" cy="8" r="1" fill="currentColor" stroke="none" />
    <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
    <circle cx="13" cy="8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 4.5V8.5l2.5 1.5" />
  </svg>
);

const IconBold = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h5a2.5 2.5 0 000-5H4v5zM4 8h5.5a2.5 2.5 0 010 5H4V8z" />
  </svg>
);

const IconItalic = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M7 2h5M4 14h5M9 2L7 14" />
  </svg>
);

// ── Modal ──────────────────────────────────────────────────────────
function NewEventModal({
  onClose,
  onCreated,
  editingEvent,
}: {
  onClose: () => void;
  onCreated: () => void;
  editingEvent?: EventType | null;
}) {
  const [form, setForm] = useState({
    title: editingEvent?.title ?? "",
    description: editingEvent?.description ?? "",
    duration: editingEvent?.duration ?? 15,
    slug: editingEvent?.slug ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setSaving(true);
    try {
      if (editingEvent) {
        await api.updateEventType(editingEvent.id, form);
      } else {
        await api.createEventType(form);
      }
      onCreated();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Close on backdrop click
  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onBackdrop}>
      <div className="modal">
        <div className="modal-body">
          <div className="modal-title">
            {editingEvent ? "Edit event type" : "Add a new event type"}
          </div>
          <div className="modal-subtitle">
            Set up event types to offer different types of meetings.
          </div>

          {error && <div className="alert-error">{error}</div>}

          {/* Title */}
          <div className="field">
            <label>Title</label>
            <input
              type="text"
              placeholder="Quick chat"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* URL */}
          <div className="field">
            <label>URL</label>
            <input
              type="text"
              placeholder="https://cal.com/twinkle-rana-r..."
              value={form.slug ? `https://cal.com/twinkle-rana-r.../${form.slug}` : ""}
              onChange={(e) => {
                // strip prefix if user types
                const val = e.target.value.replace(/.*\//, "");
                setForm({ ...form, slug: val });
              }}
            />
          </div>

          {/* Description with toolbar */}
          <div className="field">
            <label>Description</label>
            <div className="description-editor">
              <div className="description-toolbar">
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Bold"
                >
                  <IconBold />
                </button>
                <button
                  type="button"
                  className="toolbar-btn italic"
                  title="Italic"
                >
                  <IconItalic />
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="A quick video meeting."
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="field">
            <label>Duration</label>
            <div className="duration-input-wrap">
              <input
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              />
              <span className="duration-suffix">minutes</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onSubmit}
            disabled={saving || !form.title.trim()}
          >
            {saving ? "Saving…" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await api.getEventTypes();
      // attach enabled flag defaulting to true
      setEventTypes(data.map((et: EventType) => ({ ...et, enabled: et.enabled ?? true })));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const onDelete = async (id: number) => {
    if (!confirm("Delete this event type?")) return;
    await api.deleteEventType(id);
    await load();
  };

  const toggleEnabled = (id: number) => {
    setEventTypes((prev) =>
      prev.map((et) => (et.id === id ? { ...et, enabled: !et.enabled } : et))
    );
  };

  const filtered = eventTypes.filter((et) =>
    et.title.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <>
      {/* Modal */}
      {showModal && (
        <NewEventModal
          editingEvent={editingEvent}
          onClose={() => { setShowModal(false); setEditingEvent(null); }}
          onCreated={() => { setShowModal(false); setEditingEvent(null); load(); }}
        />
      )}

      <div className="et-page">

        {/* Inner topbar: title + search + new */}
        <div className="et-topbar">
          <div>
            <div className="et-topbar-title">Event types</div>
            <div className="et-topbar-sub">
              Configure different events for people to book on your calendar.
            </div>
          </div>
          <div className="et-topbar-actions">
            <div className="et-search">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="6.5" cy="6.5" r="4.5" />
                <path d="M11 11l3 3" />
              </svg>
              <input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="et-new-btn"
              onClick={() => {
                setEditingEvent(null);
                setShowModal(true);
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M8 3v10M3 8h10" />
              </svg>
              New
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert-error" style={{ margin: "0 0 12px" }}>{error}</div>}

        {/* List */}
        {loading ? (
          <div className="muted" style={{ padding: "20px 0" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <div className="empty-title">No event types yet</div>
            <div className="muted">Click "+ New" to create your first event type.</div>
          </div>
        ) : (
          <div className="et-list">
            {filtered.map((et) => (
              <div key={et.id} className="et-row">
                {/* Left: name + slug + duration badge */}
                <div className="et-info">
                  <div className="et-name">
                    {et.title}
                    <span className="et-slug">/twinkle-rana-rmqyy7/{et.slug}</span>
                  </div>
                  <div className="et-duration-badge">
                    <IconClock />
                    {et.duration}m
                  </div>
                </div>

                {/* Right: hidden label (if off) + toggle + action buttons */}
                <div className="et-actions">
                  {!et.enabled && (
                    <span className="et-hidden-label">Hidden</span>
                  )}
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={!!et.enabled}
                      onChange={() => toggleEnabled(et.id)}
                    />
                    <span className="switch-slider" />
                  </label>

                  <button
                    className="action-btn"
                    title="Open public page"
                    onClick={() => window.open(`/book/${et.slug}`, "_blank")}
                  >
                    <IconExternal />
                  </button>

                  <button
                    className="action-btn"
                    title="Copy link"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/book/${et.slug}`
                      )
                    }
                  >
                    <IconLink />
                  </button>

                  <button
                    className="action-btn"
                    title="More options"
                    onClick={() => { setEditingEvent(et); setShowModal(true); }}
                  >
                    <IconDots />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}