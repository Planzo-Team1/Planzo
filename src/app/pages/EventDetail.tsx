import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { MapPin, Clock, Star, Ticket, Users, Heart, Share2, ArrowLeft, Plus, Minus, ShieldCheck } from "lucide-react";
import { MOCK_EVENTS } from "../mock-data";
import { useCart } from "../store";

export function EventDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem, items } = useCart();
    const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);

    const setQty = (tierId: string, delta: number) =>
        setQuantities((prev) => {
            const next = Math.max(0, Math.min(10, (prev[tierId] || 0) + delta));
            return { ...prev, [tierId]: next };
        });

    const handleAddToCart = () => {
        event.tiers.forEach((tier) => {
            const qty = quantities[tier.id] || 0;
            if (qty > 0) {
                addItem({ eventId: event.id, eventTitle: event.title, tierId: tier.id, tierName: tier.name, price: tier.price, quantity: qty });
            }
        });
        setAdded(true);
        setTimeout(() => navigate("/checkout"), 800);
    };

    const totalSelected = Object.values(quantities).reduce((s, v) => s + v, 0);
    const totalPrice = event.tiers.reduce((s, tier) => s + tier.price * (quantities[tier.id] || 0), 0);

    return (
        <div style={{ paddingTop: 68, background: "var(--color-bg-base)", minHeight: "100vh" }}>
            {/* Back */}
            <div className="px-6 md:px-12 pt-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6 transition-colors" style={{ color: "#5a7a65" }}>
                    <ArrowLeft size={15} /> Back to Events
                </button>
            </div>

            {/* Hero Banner */}
            <div className="relative w-full overflow-hidden" style={{ height: 400 }}>
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,15,13,1) 0%, rgba(10,15,13,0.4) 60%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
                            {event.category}
                        </span>
                        {event.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(0,0,0,0.4)", color: "#a3e0b5" }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 max-w-3xl" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>
                        {event.title}
                    </h1>
                </div>
            </div>

            <div className="px-6 md:px-12 py-8 max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Meta */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: Clock, label: "Date & Time", value: `${event.date} · ${event.time}` },
                                { icon: MapPin, label: "Location", value: `${event.venue}, ${event.city}` },
                                { icon: Star, label: "Rating", value: `${event.rating} (${event.reviewCount} reviews)` },
                                { icon: Users, label: "Organizer", value: event.organizer },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="p-4 rounded-xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon size={13} style={{ color: "#4ade80" }} />
                                        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#5a7a65" }}>{label}</span>
                                    </div>
                                    <p className="text-sm font-medium" style={{ color: "#a3e0b5" }}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="p-6 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                            <h2 className="text-base font-bold mb-3" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>About this Event</h2>
                            <p className="text-sm leading-relaxed" style={{ color: "#a3e0b5" }}>{event.description}</p>
                        </div>

                        {/* Map Placeholder */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                            <div className="p-4 border-b" style={{ borderColor: "rgba(74,222,128,0.08)" }}>
                                <h2 className="text-base font-bold" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>Venue Location</h2>
                                <p className="text-sm mt-1" style={{ color: "#5a7a65" }}>
                                    <MapPin size={12} className="inline mr-1" style={{ color: "#4ade80" }} />
                                    {event.address}, {event.city}
                                </p>
                            </div>
                            <div
                                className="relative flex items-center justify-center"
                                style={{
                                    height: 220,
                                    background: "linear-gradient(135deg, rgba(15,26,20,1), rgba(22,33,24,1))",
                                    backgroundImage: `repeating-linear-gradient(0deg, rgba(74,222,128,0.04) 0, rgba(74,222,128,0.04) 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, rgba(74,222,128,0.04) 0, rgba(74,222,128,0.04) 1px, transparent 0, transparent 50%)`,
                                    backgroundSize: "30px 30px",
                                }}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(74,222,128,0.15)", border: "2px solid #4ade80" }}>
                                        <MapPin size={18} style={{ color: "#4ade80" }} />
                                    </div>
                                    <p className="text-sm font-medium" style={{ color: "#4ade80" }}>{event.venue}</p>
                                    <p className="text-xs" style={{ color: "#5a7a65" }}>Lat: {event.lat.toFixed(4)} · Lng: {event.lng.toFixed(4)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Ticket Selector */}
                    <div className="space-y-4">
                        <div className="sticky top-[88px] space-y-4">
                            <div className="p-6 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.2)" }}>
                                <h2 className="text-base font-bold mb-4" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>
                                    <Ticket size={16} className="inline mr-2" style={{ color: "#4ade80" }} />
                                    Select Tickets
                                </h2>

                                <div className="space-y-3">
                                    {event.tiers.map((tier) => (
                                        <div key={tier.id} className="p-4 rounded-xl" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div>
                                                    <p className="font-semibold text-sm" style={{ color: "#f0fdf4" }}>{tier.name}</p>
                                                    <p className="text-xs" style={{ color: "#5a7a65" }}>{tier.description}</p>
                                                </div>
                                                <p className="text-lg font-bold" style={{ color: "#4ade80" }}>${tier.price}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-xs" style={{ color: "#5a7a65" }}>{tier.remaining} remaining</span>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => setQty(tier.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center" style={{ color: "#f0fdf4" }}>{quantities[tier.id] || 0}</span>
                                                    <button onClick={() => setQty(tier.id, 1)} className="w-7 h-7 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {totalSelected > 0 && (
                                    <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: "#5a7a65" }}>Subtotal ({totalSelected} tickets)</span>
                                            <span className="font-bold" style={{ color: "#4ade80" }}>${totalPrice}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleAddToCart}
                                    disabled={totalSelected === 0}
                                    className="w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{ background: added ? "#22c55e" : "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a0f0d" }}
                                >
                                    {added ? "✓ Added! Redirecting..." : totalSelected > 0 ? `Buy ${totalSelected} Ticket${totalSelected > 1 ? "s" : ""} — $${totalPrice}` : "Select Tickets to Continue"}
                                </button>

                                <div className="flex items-center gap-2 mt-3 justify-center">
                                    <ShieldCheck size={13} style={{ color: "#4ade80" }} />
                                    <p className="text-xs" style={{ color: "#5a7a65" }}>Secure checkout · No booking fees</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                                    style={{ background: liked ? "rgba(248,113,113,0.1)" : "var(--color-bg-card)", border: `1px solid ${liked ? "rgba(248,113,113,0.3)" : "rgba(74,222,128,0.1)"}`, color: liked ? "#f87171" : "#5a7a65" }}
                                >
                                    <Heart size={14} fill={liked ? "#f87171" : "none"} /> {liked ? "Saved" : "Save"}
                                </button>
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
                                    style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.1)", color: "#5a7a65" }}
                                >
                                    <Share2 size={14} /> Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
