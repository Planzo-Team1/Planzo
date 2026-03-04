import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Mail, MessageCircle, Phone, Search, HelpCircle, BookOpen, CreditCard, Ticket, Calendar, Users } from "lucide-react";
import { Link } from "react-router";

// ─── Inject global keyframes + sr-visible once ────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("sp-anim-styles")) {
    const s = document.createElement("style");
    s.id = "sp-anim-styles";
    s.textContent = `
        .sp-hidden { opacity: 0; transform: translateY(32px); }
        .sp-hidden-left { opacity: 0; transform: translateX(-32px); }
        .sp-hidden-right { opacity: 0; transform: translateX(32px); }
        .sp-hidden-scale { opacity: 0; transform: scale(0.88); }
        .sp-show {
            opacity: 1 !important;
            transform: none !important;
            transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes sp-float {
            0%,100% { transform: translateY(0px) rotate(0deg); }
            33%      { transform: translateY(-18px) rotate(4deg); }
            66%      { transform: translateY(-8px) rotate(-3deg); }
        }
        @keyframes sp-pulse-ring {
            0%   { box-shadow: 0 0 0 0 rgba(249,115,22,0.35); }
            70%  { box-shadow: 0 0 0 14px rgba(249,115,22,0); }
            100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
        }
        @keyframes sp-shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position: 400px 0; }
        }
        @keyframes sp-bounce-in {
            0%   { opacity:0; transform: scale(0.5) translateY(20px); }
            60%  { transform: scale(1.08) translateY(-4px); }
            100% { opacity:1; transform: scale(1) translateY(0); }
        }
        .sp-card-hover {
            transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .sp-card-hover:hover {
            transform: translateY(-4px) scale(1.01);
            box-shadow: 0 12px 32px rgba(249,115,22,0.13);
        }
        .sp-tab-hover {
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .sp-tab-hover:hover { transform: translateY(-2px); }
    `;
    document.head.appendChild(s);
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useReveal(cls = "sp-hidden", threshold = 0.12) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.classList.add(cls);
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add("sp-show"); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [cls, threshold]);
    return ref;
}

// ─── Staggered children reveal ────────────────────────────────────────────────
function useStaggerReveal(count: number, threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = ref.current;
        if (!container) return;
        const children = Array.from(container.children) as HTMLElement[];
        children.forEach((child, i) => {
            child.style.opacity = "0";
            child.style.transform = "translateY(24px)";
            child.style.transition = `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s`;
        });
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    children.forEach(child => { child.style.opacity = "1"; child.style.transform = "none"; });
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(container);
        return () => obs.disconnect();
    }, [count, threshold]);
    return ref;
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            let start = 0;
            const step = () => {
                start += Math.ceil((target - start) / 8) || 1;
                setVal(Math.min(start, target));
                if (start < target) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [target]);
    return <span ref={ref}>{val}{suffix}</span>;
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
    {
        id: "tickets", label: "Tickets & Booking", icon: Ticket, color: "#f97316",
        questions: [
            { q: "How do I purchase a ticket?", a: "Browse events on the Discover page, click on an event you like, choose your ticket tier and quantity, then proceed to checkout. You'll receive a confirmation email with your digital ticket immediately after purchase." },
            { q: "Where can I find my tickets?", a: "Go to My Tickets in the navigation bar. All your upcoming and past tickets are shown there. You can download or view the QR code for any ticket." },
            { q: "Can I transfer my ticket to someone else?", a: "Ticket transfers are handled on a per-event basis and subject to organizer policy. Contact the event organizer directly or reach out to our support team for assistance." },
            { q: "What happens if an event is cancelled?", a: "If an event is cancelled by the organizer, you'll receive an automatic full refund to your original payment method within 5–10 business days. You'll also receive an email notification." },
        ],
    },
    {
        id: "refunds", label: "Refunds & Cancellations", icon: CreditCard, color: "#2563eb",
        questions: [
            { q: "How do I request a refund?", a: "Go to My Tickets, find the ticket you'd like to refund, and click 'Refund Request'. Select a reason, add any notes, and submit. Our team reviews all requests within 2 business days." },
            { q: "What is the refund policy?", a: "Refunds are subject to the individual event's policy set by the organizer. Generally, refunds requested more than 48 hours before the event are eligible for a full refund. Requests within 48 hours may only qualify for partial refunds." },
            { q: "How long does a refund take to process?", a: "Once approved, refunds take 5–10 business days to appear on your original payment method. Credit card refunds may take up to 2 billing cycles." },
            { q: "Can I cancel just part of my order?", a: "Yes. If you purchased multiple tickets in one order, you can submit separate cancellation requests for individual tickets." },
        ],
    },
    {
        id: "account", label: "Account & Profile", icon: Users, color: "#7c3aed",
        questions: [
            { q: "How do I update my profile information?", a: "Click your name in the top-right navigation bar and select 'Profile'. From there you can edit your name, email, phone number, and notification preferences." },
            { q: "How do I reset my password?", a: "On the Login page, click 'Forgot password?' and enter your registered email address. You'll receive a password reset link within a few minutes." },
            { q: "How do I delete my account?", a: "Go to your Profile page and scroll to the Account Actions section. Click 'Delete Account' and confirm. This action is irreversible — all your data including tickets and booking history will be permanently removed." },
            { q: "How do I manage payment methods?", a: "Navigate to your Profile page. Under 'Payment Methods' you can view or remove saved cards. New payment methods are added automatically when you complete a checkout." },
        ],
    },
    {
        id: "organizers", label: "Event Organizers", icon: Calendar, color: "#d97706",
        questions: [
            { q: "How do I become an event organizer?", a: "Register for a new account and select 'Organizer' as your role. Once logged in, you'll have access to the Organizer Dashboard where you can create and manage events." },
            { q: "How do I create an event?", a: "In the Organizer Dashboard, click 'Create Event'. Fill in the event details (title, date, venue, category, description), configure your ticket tiers with pricing, and publish." },
            { q: "When do I receive my payouts?", a: "Payouts are processed after each event concludes, typically within 3–5 business days. You can track the status of all payouts in the Finance Dashboard. Platform commission (15%) is automatically deducted." },
            { q: "Can I edit an event after publishing?", a: "Yes. In the Organizer Dashboard, click the pencil icon on any event to open the Edit modal. Changes to the date, venue, or title will trigger automatic update notifications to all existing ticket holders." },
        ],
    },
    {
        id: "general", label: "General", icon: BookOpen, color: "#059669",
        questions: [
            { q: "Is Planzo available in my city?", a: "Planzo operates globally. You can discover events in any city by searching on the Discover page. Organizers from anywhere in the world can list events on the platform." },
            { q: "What payment methods are accepted?", a: "We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover), as well as Apple Pay and Google Pay at checkout." },
            { q: "Is there a Planzo mobile app?", a: "A mobile app is currently in development for iOS and Android. In the meantime, our website is fully mobile-optimized and works great in any mobile browser." },
            { q: "How do I report an issue with an event listing?", a: "Use the contact form below or email us at support@planzo.io. Please include the event name and a brief description of the issue. Our team will investigate within 24 hours." },
        ],
    },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="sp-card-hover rounded-2xl overflow-hidden cursor-pointer"
            style={{
                background: open ? "var(--color-bg-card)" : "var(--color-bg-raised)",
                border: `1px solid ${open ? "rgba(249,115,22,0.3)" : "rgba(249,115,22,0.08)"}`,
                boxShadow: open ? "0 8px 24px rgba(249,115,22,0.08)" : "none",
                transitionDelay: `${index * 0.06}s`,
            }}
            onClick={() => setOpen(!open)}
        >
            <div className="flex items-center justify-between px-5 py-4 gap-3">
                <span className="text-sm font-semibold flex-1" style={{ color: "#1a0a00", fontFamily: "'Outfit',sans-serif" }}>{q}</span>
                <span
                    style={{
                        color: "#f97316",
                        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        display: "block",
                    }}
                >
                    <ChevronDown size={16} />
                </span>
            </div>
            <div
                style={{
                    maxHeight: open ? "300px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#78716c" }}>{a}</div>
            </div>
        </div>
    );
}

// ─── Floating Orb ────────────────────────────────────────────────────────────
function Orb({ size, x, y, delay, color }: { size: number; x: string; y: string; delay: string; color: string }) {
    return (
        <div style={{
            position: "absolute", left: x, top: y, width: size, height: size,
            borderRadius: "50%", background: color, filter: "blur(40px)", opacity: 0.35,
            animation: `sp-float ${4 + Math.random() * 3}s ease-in-out ${delay} infinite`,
            pointerEvents: "none",
        }} />
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function CustomerSupport() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("tickets");
    const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    // Reveal refs
    const badgeRef = useReveal("sp-hidden-scale", 0.1);
    const headingRef = useReveal("sp-hidden", 0.1);
    const subRef = useReveal("sp-hidden", 0.1);
    const searchRef = useReveal("sp-hidden-scale", 0.1);
    const tabsRef = useStaggerReveal(FAQ_CATEGORIES.length, 0.1);
    const faqRef = useStaggerReveal(4, 0.1);
    const sidebarRef = useReveal("sp-hidden-right", 0.1);
    const statsRef = useReveal("sp-hidden", 0.08);
    const formRef = useReveal("sp-hidden", 0.05);

    const activeData = FAQ_CATEGORIES.find(c => c.id === activeCategory)!;

    const searchResults = search.trim().length > 1
        ? FAQ_CATEGORIES.flatMap(cat => cat.questions.filter(q =>
            q.q.toLowerCase().includes(search.toLowerCase()) ||
            q.a.toLowerCase().includes(search.toLowerCase())
        ).map(q => ({ ...q, category: cat.label })))
        : [];

    const handleContact = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
    };

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }}>

            {/* ─── Hero ─── */}
            <div className="px-6 py-16 text-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.07) 0%, rgba(239,68,68,0.04) 100%)" }}>

                {/* Floating orbs */}
                <Orb size={220} x="-5%" y="10%" delay="0s" color="rgba(249,115,22,0.25)" />
                <Orb size={160} x="80%" y="-10%" delay="1.2s" color="rgba(239,68,68,0.2)" />
                <Orb size={100} x="60%" y="60%" delay="0.6s" color="rgba(249,115,22,0.15)" />
                <Orb size={80} x="20%" y="70%" delay="2s" color="rgba(124,58,237,0.12)" />

                <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Badge */}
                    <div ref={badgeRef} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 999, marginBottom: 16, fontSize: 12, fontWeight: 600, background: "rgba(249,115,22,0.12)", color: "#f97316", animation: "sp-pulse-ring 2.5s ease-out 1s infinite" }}>
                        <HelpCircle size={12} /> Support Center
                    </div>

                    {/* Heading */}
                    <div ref={headingRef} style={{ transitionDelay: "0.1s" }}>
                        <h1 style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Outfit',sans-serif", color: "#1a0a00", lineHeight: 1.15, marginBottom: 12 }}>
                            How can we <span style={{ color: "#f97316" }}>help</span>?
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div ref={subRef} style={{ transitionDelay: "0.18s" }}>
                        <p style={{ fontSize: 15, color: "#78716c", maxWidth: 480, margin: "0 auto 32px" }}>
                            Search our FAQ or browse by category below. Can't find what you need? Send us a message.
                        </p>
                    </div>

                    {/* Search */}
                    <div ref={searchRef} style={{ maxWidth: 480, margin: "0 auto", transitionDelay: "0.26s" }}>
                        <div style={{ position: "relative" }}>
                            <Search size={16} style={{
                                position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                                color: searchFocused ? "#f97316" : "#78716c",
                                transition: "color 0.25s, transform 0.3s",
                                ...(searchFocused ? { transform: "translateY(-50%) scale(1.15)" } : {}),
                            }} />
                            <input
                                type="text"
                                placeholder="Search questions…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                style={{
                                    width: "100%", paddingLeft: 44, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
                                    borderRadius: 16, fontSize: 14, outline: "none",
                                    background: "var(--color-bg-card)",
                                    border: `1.5px solid ${searchFocused ? "rgba(249,115,22,0.5)" : "rgba(249,115,22,0.2)"}`,
                                    boxShadow: searchFocused ? "0 4px 24px rgba(249,115,22,0.12)" : "none",
                                    color: "#1a0a00",
                                    transition: "border-color 0.25s, box-shadow 0.25s",
                                }}
                            />
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div style={{ marginTop: 8, borderRadius: 16, overflow: "hidden", textAlign: "left", background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.15)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                                {searchResults.map((r, i) => (
                                    <div key={i} style={{
                                        padding: "12px 20px", borderBottom: i < searchResults.length - 1 ? "1px solid rgba(249,115,22,0.06)" : "none",
                                        opacity: 0, animation: `sp-bounce-in 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s forwards`,
                                    }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: "#f97316", marginBottom: 2 }}>{r.category}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0a00" }}>{r.q}</div>
                                        <div style={{ fontSize: 12, marginTop: 2, color: "#78716c", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.a}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {search.trim().length > 1 && searchResults.length === 0 && (
                            <p style={{ marginTop: 12, fontSize: 13, color: "#78716c" }}>No results for "<strong>{search}</strong>". Try another keyword or contact us below.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Stats bar ─── */}
            <div ref={statsRef} style={{ background: "var(--color-bg-card)", borderBottom: "1px solid rgba(249,115,22,0.07)", padding: "16px 48px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap" }}>
                    {[
                        { label: "Events Listed", val: 200, suffix: "+" },
                        { label: "Happy Attendees", val: 50, suffix: "k+" },
                        { label: "Avg Response Time", val: 24, suffix: "h" },
                        { label: "Satisfaction Rate", val: 98, suffix: "%" },
                    ].map(({ label, val, suffix }) => (
                        <div key={label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Outfit',sans-serif", color: "#f97316" }}>
                                <AnimCounter target={val} suffix={suffix} />
                            </div>
                            <div style={{ fontSize: 11, color: "#78716c", marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Body ─── */}
            <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>

                {/* Category tabs */}
                <div ref={tabsRef} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                    {FAQ_CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const active = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
                                className="sp-tab-hover"
                                style={{
                                    display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                                    borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                    background: active ? cat.color : "var(--color-bg-card)",
                                    color: active ? "#fff" : "#78716c",
                                    border: `1px solid ${active ? cat.color : "rgba(249,115,22,0.1)"}`,
                                    boxShadow: active ? `0 6px 16px ${cat.color}55` : "none",
                                    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                                }}
                            >
                                <Icon size={12} /> {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>

                    {/* FAQ list */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                            {React.createElement(activeData.icon, { size: 18, style: { color: activeData.color } })}
                            <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: "#1a0a00" }}>{activeData.label}</h2>
                        </div>
                        <div ref={faqRef} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {activeData.questions.map((item, i) => (
                                <FAQItem key={`${activeCategory}-${i}`} q={item.q} a={item.a} index={i} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div ref={sidebarRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Contact cards */}
                        <div style={{ borderRadius: 20, padding: 20, background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.08)" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1a0a00", fontFamily: "'Outfit',sans-serif", marginBottom: 16 }}>Contact Us</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    { icon: Mail, label: "Email Support", sub: "support@planzo.io", color: "#f97316" },
                                    { icon: MessageCircle, label: "Live Chat", sub: "Available 9am – 6pm EST", color: "#2563eb" },
                                    { icon: Phone, label: "Phone", sub: "+1 (888) 726-5966", color: "#7c3aed" },
                                ].map(({ icon: Icon, label, sub, color }, i) => (
                                    <div key={label} className="sp-card-hover" style={{
                                        display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 14,
                                        background: "var(--color-bg-raised)",
                                        opacity: 0, animation: `sp-bounce-in 0.4s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.1}s forwards`,
                                    }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, flexShrink: 0 }}>
                                            <Icon size={16} style={{ color }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a0a00" }}>{label}</div>
                                            <div style={{ fontSize: 11, color: "#78716c" }}>{sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Response time card */}
                        <div className="sp-card-hover" style={{ borderRadius: 20, padding: 20, textAlign: "center", background: "linear-gradient(135deg,rgba(249,115,22,0.08),rgba(239,68,68,0.05))", border: "1px solid rgba(249,115,22,0.14)" }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "#f97316", fontFamily: "'Outfit',sans-serif", animation: "sp-pulse-ring 3s ease-out 2s infinite", display: "inline-block", borderRadius: 8, padding: "2px 10px" }}>
                                &lt; 24h
                            </div>
                            <div style={{ fontSize: 12, color: "#78716c", marginTop: 4 }}>Average response time</div>
                        </div>

                        {/* Back link */}
                        <Link to="/profile" style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            padding: "12px 0", borderRadius: 16, fontSize: 12, fontWeight: 600,
                            background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.1)",
                            color: "#f97316", textDecoration: "none", transition: "all 0.25s",
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(249,115,22,0.06)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-bg-card)"; }}
                        >
                            ← Back to Profile
                        </Link>
                    </div>
                </div>

                {/* ─── Contact Form ─── */}
                <div ref={formRef} style={{
                    marginTop: 48, borderRadius: 28, padding: 40,
                    background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.08)", transitionDelay: "0.1s",
                }}>
                    <div style={{ maxWidth: 640, margin: "0 auto" }}>
                        <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", fontFamily: "'Outfit',sans-serif", color: "#1a0a00", marginBottom: 4 }}>Send Us a Message</h2>
                        <p style={{ fontSize: 13, textAlign: "center", color: "#78716c", marginBottom: 32 }}>Can't find your answer above? We'll get back to you within 24 hours.</p>

                        {submitted ? (
                            <div style={{ textAlign: "center", padding: "40px 0", animation: "sp-bounce-in 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
                                <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", background: "rgba(249,115,22,0.1)", animation: "sp-pulse-ring 2s ease-out infinite" }}>
                                    <MessageCircle size={28} style={{ color: "#f97316" }} />
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a0a00", fontFamily: "'Outfit',sans-serif", marginBottom: 8 }}>Message Sent!</h3>
                                <p style={{ fontSize: 13, color: "#78716c" }}>Thanks for reaching out. Our team will reply to <strong>{contactForm.email}</strong> shortly.</p>
                                <button
                                    onClick={() => { setSubmitted(false); setContactForm({ name: "", email: "", subject: "", message: "" }); }}
                                    style={{ marginTop: 24, padding: "10px 24px", borderRadius: 12, fontSize: 13, fontWeight: 700, background: "rgba(249,115,22,0.1)", color: "#f97316", cursor: "pointer", border: "none" }}
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleContact} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {[
                                    { key: "name", label: "Your Name", placeholder: "Jane Smith", type: "text", span: 1, delay: "0.05s" },
                                    { key: "email", label: "Email Address", placeholder: "jane@email.com", type: "email", span: 1, delay: "0.1s" },
                                    { key: "subject", label: "Subject", placeholder: "Brief summary of your issue", type: "text", span: 2, delay: "0.15s" },
                                ].map(({ key, label, placeholder, type, span, delay }) => (
                                    <div key={key} style={{ gridColumn: `span ${span}`, opacity: 0, animation: `sp-bounce-in 0.4s cubic-bezier(0.22,1,0.36,1) ${delay} forwards` }}>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#1a0a00", marginBottom: 6 }}>{label}</label>
                                        <input
                                            type={type} required placeholder={placeholder}
                                            value={contactForm[key as keyof typeof contactForm]}
                                            onChange={e => setContactForm(prev => ({ ...prev, [key]: e.target.value }))}
                                            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 13, outline: "none", background: "var(--color-bg-raised)", border: "1px solid rgba(249,115,22,0.2)", color: "#1a0a00", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
                                            onFocus={e => { e.target.style.borderColor = "rgba(249,115,22,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; }}
                                            onBlur={e => { e.target.style.borderColor = "rgba(249,115,22,0.2)"; e.target.style.boxShadow = "none"; }}
                                        />
                                    </div>
                                ))}
                                <div style={{ gridColumn: "span 2", opacity: 0, animation: "sp-bounce-in 0.4s cubic-bezier(0.22,1,0.36,1) 0.2s forwards" }}>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#1a0a00", marginBottom: 6 }}>Message</label>
                                    <textarea
                                        required rows={5} placeholder="Describe your issue in detail…"
                                        value={contactForm.message}
                                        onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 13, outline: "none", background: "var(--color-bg-raised)", border: "1px solid rgba(249,115,22,0.2)", color: "#1a0a00", resize: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
                                        onFocus={e => { e.target.style.borderColor = "rgba(249,115,22,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; }}
                                        onBlur={e => { e.target.style.borderColor = "rgba(249,115,22,0.2)"; e.target.style.boxShadow = "none"; }}
                                    />
                                </div>
                                <div style={{ gridColumn: "span 2", textAlign: "right", opacity: 0, animation: "sp-bounce-in 0.4s cubic-bezier(0.22,1,0.36,1) 0.25s forwards" }}>
                                    <button
                                        type="submit" disabled={submitting}
                                        style={{ padding: "12px 32px", borderRadius: 14, fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, border: "none", boxShadow: "0 4px 16px rgba(249,115,22,0.35)", transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s" }}
                                        onMouseEnter={e => { if (!submitting) { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(249,115,22,0.45)"; } }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(249,115,22,0.35)"; }}
                                    >
                                        {submitting ? "Sending…" : "Send Message"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
