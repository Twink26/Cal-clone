import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  hideTopbar?: boolean;
};

const NavIcon = ({ path }: { path: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

export function DashboardLayout({ children, hideTopbar = false }: Props) {
  const location = useLocation();
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [appsOpen, setAppsOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <div className="app-shell">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">

        {/* User profile row */}
        <div className="sidebar-profile">
          <div className="sidebar-avatar">T</div>
          <span className="sidebar-username">Twinkle Rana</span>
          <button className="sidebar-profile-btn" title="Switch account">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          <button className="sidebar-profile-btn" title="Search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="6.5" cy="6.5" r="4" />
              <path d="M10 10l3 3" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">

          <Link to="/" className={`sidebar-link ${isActive("/") && !isActive("/availability") && !isActive("/bookings") ? "active" : ""}`}>
            <NavIcon path="M2 5h3v3H2zM7 2h3v3H7zM7 9h3v3H7zM12 5h3v3h-3z" />
            Event types
          </Link>

          <Link to="/bookings" className={`sidebar-link ${isActive("/bookings") ? "active" : ""}`}>
            <NavIcon path="M2 3h12a1 1 0 011 1v9a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1zM1 7h14" />
            Bookings
          </Link>

          <Link to="/availability" className={`sidebar-link ${isActive("/availability") ? "active" : ""}`}>
            <NavIcon path="M8 1a7 7 0 100 14A7 7 0 008 1zM8 4v4.5l2.5 1.5" />
            Availability
          </Link>

          {/* Teams */}
          <a className="sidebar-link" href="#" onClick={e => e.preventDefault()}>
            <NavIcon path="M1 12s1.5-2 5-2 5 2 5 2M11 12s1-1.5 3.5-1.5M6 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12.5 8a2 2 0 100-4 2 2 0 000 4" />
            Teams
          </a>

          {/* Apps with chevron */}
          <button
            className="sidebar-link sidebar-link-btn"
            onClick={() => setAppsOpen(o => !o)}
          >
            <NavIcon path="M2 2h4v4H2zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z" />
            Apps
            <svg className={`sidebar-chevron ${appsOpen ? "open" : ""}`} width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          {appsOpen && (
            <div className="sidebar-sub">
              <a className="sidebar-sub-link" href="#" onClick={e => e.preventDefault()}>App Store</a>
              <a className="sidebar-sub-link" href="#" onClick={e => e.preventDefault()}>Installed</a>
            </div>
          )}

          {/* Routing */}
          <a className="sidebar-link" href="#" onClick={e => e.preventDefault()}>
            <NavIcon path="M1 8h9M7 5l3 3-3 3M12 4a2 2 0 110 4M12 8a2 2 0 110 4" />
            Routing
          </a>

          {/* Workflows */}
          <a className="sidebar-link" href="#" onClick={e => e.preventDefault()}>
            <NavIcon path="M3 3l10 0M3 8h6M3 13h4M11 8l2 2.5L11 13" />
            Workflows
          </a>

          {/* Insights with chevron + sub-items */}
          <button
            className="sidebar-link sidebar-link-btn"
            onClick={() => setInsightsOpen(o => !o)}
          >
            <NavIcon path="M1 12l3.5-4 3 2.5 3-5 3.5 3.5" />
            Insights
            <svg className={`sidebar-chevron ${insightsOpen ? "open" : ""}`} width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          {insightsOpen && (
            <div className="sidebar-sub">
              <a className="sidebar-sub-link" href="#" onClick={e => e.preventDefault()}>Bookings</a>
              <a className="sidebar-sub-link" href="#" onClick={e => e.preventDefault()}>Routing</a>
              <a className="sidebar-sub-link" href="#" onClick={e => e.preventDefault()}>Router position</a>
              <a className="sidebar-sub-link" href="#" onClick={e => e.preventDefault()}>Call history</a>
              <a className="sidebar-sub-link" href="#" onClick={e => e.preventDefault()}>Wrong routing</a>
            </div>
          )}
        </nav>

        {/* Footer links */}
        <div className="sidebar-footer">
          <a className="sidebar-link" href="#" onClick={e => e.preventDefault()}>
            <NavIcon path="M7 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V9M9 1h6v6M15 1L8 8" />
            View public page
          </a>
          <a className="sidebar-link" href="#" onClick={e => e.preventDefault()}>
            <NavIcon path="M10 2H6a1 1 0 00-1 1v2H3a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1h-2V3a1 1 0 00-1-1z" />
            Copy public page link
          </a>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">
        {!hideTopbar && (
          <header className="topbar">
            <div>
              <h1 className="topbar-title">
                {location.pathname === "/" && "Event types"}
                {location.pathname.startsWith("/bookings") && "Bookings"}
                {location.pathname.startsWith("/availability") && "Availability"}
              </h1>
              <p className="topbar-subtitle">
                {location.pathname === "/" && "Configure different events for people to book on your calendar."}
                {location.pathname.startsWith("/bookings") && "View and manage your upcoming bookings."}
                {location.pathname.startsWith("/availability") && "Configure times when you are available for bookings."}
              </p>
            </div>
            <div className="topbar-actions">
              <div className="topbar-search">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="6.5" cy="6.5" r="4.5" />
                  <path d="M11 11l3 3" />
                </svg>
                <span>Search</span>
              </div>
              <button className="topbar-new-btn">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M8 3v10M3 8h10" />
                </svg>
                New
              </button>
            </div>
          </header>
        )}
        <section className="main-content">{children}</section>
      </main>
    </div>
  );
}