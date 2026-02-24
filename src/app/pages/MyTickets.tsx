import React, { useState } from "react";
import { Link } from "react-router";
import { Ticket, Clock, MapPin, X, Star, QrCode } from "lucide-react";
import { MOCK_BOOKINGS } from "../mock-data";

export function MyTickets() {
    const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [cancelled, setCancelled] = useState<string[]>([]);

    const upcoming = MOCK_BOOKINGS.filter((b) => b.status !== "cancelled" && !cancelled.includes(b.id));
    const past: typeof MOCK_BOOKINGS = [];

    const visibleBookings = tab === "upcoming" ? upcoming : past;

    const handleCancel = (id: string) => {
        setCancellingId(id);
        setTimeout(() => {
            setCancelled((prev) => [...prev, id]);
            setCancellingId(null);
        }, 800);
    };

    const statusColor = (status: string) => {
        if (status === "confirmed") return { bg: "rgba(74,222,128,0.1)", color: "#4ade80", label: "Confirmed" };
        if (status === "pending") return { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", label: "Pending" };
        return { bg: "rgba(248,113,113,0.1)", color: "#f87171", label: "Cancelled" };
    };

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }}>
            <div className="px-6 md:px-12 py-8 max-w-[900px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>My Tickets</h1>
                    <p className="text-sm" style={{ color: "#5a7a65" }}>Manage your bookings and access your event tickets</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Total Bookings", value: MOCK_BOOKINGS.length, color: "#4ade80" },
                        { label: "Confirmed", value: MOCK_BOOKINGS.filter(b => b.status === "confirmed").length, color: "#4ade80" },
                        { label: "Total Spent", value: `$${MOCK_BOOKINGS.reduce((s, b) => s + b.total, 0)}`, color: "#4ade80" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="p-4 rounded-xl text-center" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                            <p className="text-xl font-bold" style={{ color }}>{value}</p>
                            <p className="text-xs mt-1" style={{ color: "#5a7a65" }}>{label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {(["upcoming", "past"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="px-4 py-2 rounded-full text-sm font-medium capitalize transition-all"
                            style={{
                                background: tab === t ? "#4ade80" : "rgba(74,222,128,0.06)",
                                color: tab === t ? "#0a0f0d" : "#a3e0b5",
                                border: `1px solid ${tab === t ? "#4ade80" : "rgba(74,222,128,0.15)"}`,
                            }}
                        >
                            {t} ({t === "upcoming" ? upcoming.length : past.length})
                        </button>
                    ))}
                </div>

                {/* Ticket List */}
                {visibleBookings.length === 0 ? (
                    <div className="text-center py-16">
                        <Ticket size={48} className="mx-auto mb-4" style={{ color: "#2a3d32" }} />
                        <p className="text-base font-medium mb-2" style={{ color: "#5a7a65" }}>No {tab} tickets</p>
                        <Link to="/" className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#4ade80", color: "#0a0f0d", textDecoration: "none" }}>
                            Find Events
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {visibleBookings.map((booking) => {
                            const sc = statusColor(booking.status);
                            return (
                                <div key={booking.id} className="p-5 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.1)" }}>
                                    <div className="flex flex-col md:flex-row gap-5">
                                        {/* QR Code */}
                                        <div
                                            className="w-24 h-24 rounded-xl flex-shrink-0 flex items-center justify-center"
                                            style={{
                                                background: "rgba(74,222,128,0.06)",
                                                border: "1px solid rgba(74,222,128,0.2)",
                                                backgroundImage: `repeating-linear-gradient(0deg,rgba(74,222,128,0.08) 0,rgba(74,222,128,0.08) 2px,transparent 0,transparent 6px),repeating-linear-gradient(90deg,rgba(74,222,128,0.08) 0,rgba(74,222,128,0.08) 2px,transparent 0,transparent 6px)`,
                                            }}
                                        >
                                            <QrCode size={32} style={{ color: "#4ade80" }} />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="font-bold text-sm" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>{booking.eventTitle}</h3>
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0" style={{ background: sc.bg, color: sc.color }}>
                                                    {sc.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
                                                <span className="flex items-center gap-1" style={{ color: "#5a7a65" }}><Clock size={10} /> {booking.eventDate}</span>
                                                <span className="flex items-center gap-1" style={{ color: "#5a7a65" }}><MapPin size={10} /> {booking.eventVenue}</span>
                                                <span className="flex items-center gap-1" style={{ color: "#5a7a65" }}><Ticket size={10} /> {booking.tierName} × {booking.quantity}</span>
                                                <span className="font-bold" style={{ color: "#4ade80" }}>${booking.total}</span>
                                            </div>

                                            <p className="text-xs font-mono mb-3" style={{ color: "#2a3d32" }}>{booking.qrCode}</p>

                                            <div className="flex gap-2">
                                                <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
                                                    Download Ticket
                                                </button>
                                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
                                                    <Star size={10} /> Rate Event
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(booking.id)}
                                                    disabled={cancellingId === booking.id}
                                                    className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                                    style={{ background: "rgba(248,113,113,0.06)", color: "#f87171", border: "1px solid rgba(248,113,113,0.15)" }}
                                                >
                                                    {cancellingId === booking.id ? (
                                                        <div className="w-3 h-3 border border-[#f87171] border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <><X size={10} /> Cancel</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
