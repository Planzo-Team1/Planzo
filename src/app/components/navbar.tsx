import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth, useCart } from "../store";
import {
  MapPin, Ticket, LayoutDashboard, BarChart2, DollarSign,
  Megaphone, LogIn, UserPlus, LogOut, ShoppingCart, Menu, X, Zap
} from "lucide-react";

const NAV_LINKS = [
  { label: "Discover", path: "/", icon: MapPin, roles: ["attendee", "organizer", "admin", "finance", "marketing"] },
  { label: "My Tickets", path: "/my-tickets", icon: Ticket, roles: ["attendee"] },
  { label: "Organizer", path: "/organizer", icon: LayoutDashboard, roles: ["organizer", "admin"] },
  { label: "Analytics", path: "/analytics", icon: BarChart2, roles: ["organizer", "admin", "marketing", "finance"] },
  { label: "Finance", path: "/admin", icon: DollarSign, roles: ["admin", "finance"] },
  { label: "Marketing", path: "/marketing", icon: Megaphone, roles: ["admin", "marketing"] },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { items, total } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleLinks = NAV_LINKS.filter(
    (l) => !currentUser || l.roles.includes(currentUser.role)
  );

  const roleColor: Record<string, string> = {
    attendee: "#4ade80",
    organizer: "#60a5fa",
    admin: "#f87171",
    finance: "#fbbf24",
    marketing: "#c084fc",
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-6 md:px-12"
      style={{
        background: "rgba(10,15,13,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(74,222,128,0.12)",
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}
        >
          <Zap size={16} color="#0a0f0d" strokeWidth={2.5} />
        </div>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}
        >
          Plan<span style={{ color: "#4ade80" }}>zo</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-1">
        {visibleLinks.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: active ? "#4ade80" : "#a3e0b5",
                background: active ? "rgba(74,222,128,0.12)" : "transparent",
                textDecoration: "none",
              }}
            >
              <link.icon size={14} />
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Cart */}
        {items.length > 0 && (
          <button
            onClick={() => navigate("/checkout")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}
          >
            <ShoppingCart size={14} />
            {items.length} · ${total.toFixed(0)}
          </button>
        )}

        {currentUser ? (
          <div className="flex items-center gap-3">
            {/* User badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: roleColor[currentUser.role] || "#4ade80", color: "#0a0f0d" }}
              >
                {currentUser.avatar}
              </div>
              <span className="text-sm font-medium" style={{ color: "#a3e0b5" }}>{currentUser.name.split(" ")[0]}</span>
              <span className="text-xs px-1.5 py-0.5 rounded capitalize" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>{currentUser.role}</span>
            </div>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#5a7a65" }}
              title="Log out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all" style={{ color: "#a3e0b5", textDecoration: "none" }}>
              <LogIn size={14} /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a0f0d", textDecoration: "none" }}
            >
              <UserPlus size={14} /> Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="lg:hidden p-2 rounded-lg"
        style={{ color: "#4ade80" }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden absolute top-[68px] left-0 right-0 p-4 flex flex-col gap-1"
          style={{ background: "rgba(10,15,13,0.98)", borderBottom: "1px solid rgba(74,222,128,0.15)" }}
        >
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium"
              style={{ color: location.pathname === link.path ? "#4ade80" : "#a3e0b5", textDecoration: "none", background: location.pathname === link.path ? "rgba(74,222,128,0.1)" : "transparent" }}
            >
              <link.icon size={15} /> {link.label}
            </Link>
          ))}
          <hr style={{ borderColor: "rgba(74,222,128,0.1)", margin: "8px 0" }} />
          {currentUser ? (
            <button onClick={() => { logout(); navigate("/login"); setMobileOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm" style={{ color: "#f87171" }}>
              <LogOut size={14} /> Log Out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm" style={{ color: "#a3e0b5", textDecoration: "none" }}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-bold text-center" style={{ background: "#4ade80", color: "#0a0f0d", textDecoration: "none" }}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
