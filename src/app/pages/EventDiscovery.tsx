import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Search, MapPin, SlidersHorizontal, Star, Clock, Ticket, Sparkles, ChevronRight, ArrowRight } from "lucide-react";
import { MOCK_EVENTS, Event } from "../mock-data";

const CATEGORIES = ["All", "Music", "Tech", "Food", "Art", "Wellness"];

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
            { threshold: 0.12 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return ref;
}

// ─── Animated Event Card ──────────────────────────────────────────────────────
function EventCard({ event, index }: { event: Event; index: number }) {
    const ref = useReveal();
    return (
        <div
            ref={ref}
            className="reveal"
            style={{ transitionDelay: `${Math.min(index % 4, 3) * 80}ms` }}
        >
            <Link to={`/events/${event.id}`} style={{ textDecoration: "none" }}>
                <div
                    className="card-lift group rounded-2xl overflow-hidden"
                    style={{
                        background: "#ffffff",
                        border: "1px solid rgba(249,115,22,0.1)",
                        boxShadow: "0 4px 20px rgba(249,115,22,0.07)",
                        cursor: "pointer",
                    }}
                >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: 200 }}>
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)" }} />
                        {event.featured && (
                            <div
                                className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                                style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#ffffff" }}
                            >
                                <Sparkles size={11} /> Featured
                            </div>
                        )}
                        <div
                            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }}
                        >
                            {event.category}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                                <MapPin size={11} /> {event.distance?.toFixed(1)} km · {event.city}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2" style={{ color: "#1a0a00", fontFamily: "'Outfit',sans-serif" }}>
                            {event.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "#78716c" }}>
                            <span className="flex items-center gap-1"><Clock size={11} /> {event.date}</span>
                            <span className="flex items-center gap-1"><Star size={11} style={{ color: "#f97316" }} /> {event.rating} ({event.reviewCount})</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {event.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-md text-xs transition-all hover:scale-105"
                                    style={{ background: "rgba(249,115,22,0.08)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs" style={{ color: "#78716c" }}>From </span>
                                <span className="text-base font-bold" style={{ color: "#f97316" }}>
                                    ${Math.min(...event.tiers.map((t) => t.price))}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#f97316" }}>
                                <Ticket size={12} /> {event.tiers.reduce((s, t) => s + t.remaining, 0)} left
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

// ─── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard({ event, index }: { event: Event; index: number }) {
    return (
        <Link
            to={`/events/${event.id}`}
            style={{ textDecoration: "none" }}
            className={`anim-scale-in delay-${index + 1}`}
        >
            <div
                className="relative rounded-2xl overflow-hidden group card-lift"
                style={{ height: 220, border: "1px solid rgba(249,115,22,0.25)" }}
            >
                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 40%, transparent 85%)" }} />
                {/* Shine sweep on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)" }}
                />
                <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-medium mb-1" style={{ color: "#fdba74" }}>{event.date} · {event.city}</p>
                    <h3 className="font-bold text-sm leading-snug flex items-center gap-1" style={{ color: "#ffffff", fontFamily: "'Outfit',sans-serif" }}>
                        {event.title}
                    </h3>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                        From ${Math.min(...event.tiers.map(t => t.price))}
                        <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1" />
                    </p>
                </div>
            </div>
        </Link>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function EventDiscovery() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("featured");

    const filtered = useMemo(() => {
        let events = [...MOCK_EVENTS];
        if (search) events = events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase()));
        if (category !== "All") events = events.filter((e) => e.category === category);
        if (sortBy === "price-asc") events.sort((a, b) => Math.min(...a.tiers.map(t => t.price)) - Math.min(...b.tiers.map(t => t.price)));
        if (sortBy === "rating") events.sort((a, b) => b.rating - a.rating);
        if (sortBy === "featured") events.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        return events;
    }, [search, category, sortBy]);

    const featured = MOCK_EVENTS.filter((e) => e.featured).slice(0, 3);

    // Floating orb refs for hero decoration
    const featuredRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        [featuredRef, filtersRef].forEach(ref => {
            const el = ref.current;
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
                { threshold: 0.1 }
            );
            obs.observe(el);
            return () => obs.disconnect();
        });
    }, []);

    return (
        <div style={{ paddingTop: 68 }}>
            {/* ── Hero Section ── */}
            <div
                className="hero-gradient relative py-20 px-6 md:px-12 text-center overflow-hidden"
                style={{ borderBottom: "1px solid rgba(249,115,22,0.12)" }}
            >
                {/* Decorative floating orbs */}
                <div
                    className="anim-float absolute rounded-full blur-3xl pointer-events-none"
                    style={{ width: 320, height: 320, top: -80, left: -80, background: "rgba(249,115,22,0.12)", animationDelay: "0s" }}
                />
                <div
                    className="anim-float absolute rounded-full blur-3xl pointer-events-none"
                    style={{ width: 260, height: 260, top: -60, right: -60, background: "rgba(139,92,246,0.1)", animationDelay: "2s" }}
                />
                <div
                    className="anim-float absolute rounded-full blur-2xl pointer-events-none"
                    style={{ width: 180, height: 180, bottom: -40, left: "50%", background: "rgba(239,68,68,0.08)", animationDelay: "1s" }}
                />

                {/* Badge */}
                <div
                    className="anim-fade-up delay-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                    style={{ background: "rgba(249,115,22,0.12)", color: "#ea580c", border: "1px solid rgba(249,115,22,0.25)" }}
                >
                    <Sparkles size={12} className="anim-float" style={{ animation: "float 2.5s ease-in-out infinite" }} />
                    Events near you
                </div>

                {/* Headline */}
                <h1
                    className="anim-fade-up delay-1 text-4xl md:text-6xl font-black mb-4"
                    style={{ fontFamily: "'Outfit',sans-serif", color: "#1a0a00", lineHeight: 1.1 }}
                >
                    Discover{" "}
                    <span className="shimmer-text">Unforgettable</span>{" "}
                    Events
                </h1>

                <p
                    className="anim-fade-up delay-2 text-base md:text-lg mb-10 max-w-xl mx-auto"
                    style={{ color: "#78716c" }}
                >
                    Find concerts, workshops, food festivals, and more — near you, right now.
                </p>

                {/* Search bar */}
                <div className="anim-fade-up delay-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                    <div className="relative flex-1 group">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                            style={{ color: "#f97316" }}
                        />
                        <input
                            type="text"
                            placeholder="Search events, cities, venues..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                            style={{
                                background: "#ffffff",
                                border: "1.5px solid rgba(249,115,22,0.25)",
                                color: "#1a0a00",
                                boxShadow: "0 2px 12px rgba(249,115,22,0.08)",
                            }}
                            onFocus={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.15)"; }}
                            onBlur={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.25)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(249,115,22,0.08)"; }}
                        />
                    </div>
                    <button
                        className="btn-pulse flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                        style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#ffffff", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(249,115,22,0.38)" }}
                    >
                        <MapPin size={14} /> Use My Location
                    </button>
                </div>

                {/* Scroll hint */}
                <div
                    className="anim-fade-in delay-7 absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
                    style={{ opacity: 0.45 }}
                >
                    <div
                        style={{
                            width: 1.5,
                            height: 32,
                            borderRadius: 99,
                            background: "linear-gradient(to bottom, #f97316, transparent)",
                            animation: "float 1.8s ease-in-out infinite",
                        }}
                    />
                </div>
            </div>

            <div className="px-6 md:px-12 py-10 max-w-[1400px] mx-auto">

                {/* ── Featured Strip ── */}
                <div
                    ref={featuredRef}
                    className="reveal mb-12"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2
                            className="text-xl font-bold flex items-center gap-2"
                            style={{ fontFamily: "'Outfit',sans-serif", color: "#1a0a00" }}
                        >
                            <span style={{ color: "#f97316" }}>✦</span> Featured Events
                        </h2>
                        <Link
                            to="/"
                            className="flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2"
                            style={{ color: "#f97316", textDecoration: "none" }}
                        >
                            View all <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {featured.map((event, i) => (
                            <FeaturedCard key={event.id} event={event} index={i} />
                        ))}
                    </div>
                </div>

                {/* ── Filters ── */}
                <div
                    ref={filtersRef}
                    className="reveal flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
                >
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat, i) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                                style={{
                                    background: category === cat ? "linear-gradient(135deg,#f97316,#ef4444)" : "rgba(249,115,22,0.06)",
                                    color: category === cat ? "#fff" : "#92400e",
                                    border: `1.5px solid ${category === cat ? "transparent" : "rgba(249,115,22,0.18)"}`,
                                    boxShadow: category === cat ? "0 4px 14px rgba(249,115,22,0.3)" : "none",
                                    transitionDelay: `${i * 30}ms`,
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="sm:ml-auto flex items-center gap-2">
                        <SlidersHorizontal size={14} style={{ color: "#78716c" }} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="py-2 px-3 rounded-xl text-sm outline-none"
                            style={{ background: "var(--color-bg-card)", color: "#92400e", border: "1px solid rgba(249,115,22,0.2)" }}
                        >
                            <option value="featured">Featured First</option>
                            <option value="rating">Top Rated</option>
                            <option value="price-asc">Price: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* ── Events Grid ── */}
                <div className="mb-6 flex items-center justify-between">
                    <p
                        className="text-sm font-medium"
                        style={{ color: "#78716c" }}
                    >
                        <span style={{ color: "#f97316", fontWeight: 700 }}>{filtered.length}</span> events found
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((event, i) => (
                        <EventCard key={event.id} event={event} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
