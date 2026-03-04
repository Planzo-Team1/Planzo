import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
    User, Mail, Shield, Bell, CreditCard, Trash2, MessageSquare,
    Save, ChevronRight, X, Check, AlertTriangle, LogOut, Edit3, Phone
} from "lucide-react";
import { useAuth } from "../store";

export function UserProfile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [phone, setPhone] = useState("+1 (555) 000-0000");
    const [saved, setSaved] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [supportMsg, setSupportMsg] = useState("");
    const [supportSent, setSupportSent] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");

    // Notification toggles
    const [notifs, setNotifs] = useState({
        bookingConfirm: true,
        eventReminders: true,
        refundUpdates: true,
        promotions: false,
        newEvents: true,
        priceDrops: false,
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDeleteAccount = () => {
        if (deleteInput === "DELETE") {
            logout();
            navigate("/");
        }
    };

    const handleSupportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSupportSent(true);
        setTimeout(() => {
            setShowSupport(false);
            setSupportSent(false);
            setSupportMsg("");
        }, 2000);
    };

    if (!currentUser) {
        navigate("/login");
        return null;
    }

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }}>
            <div className="px-6 md:px-12 py-8 max-w-[900px] mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black"
                        style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff" }}
                    >
                        {currentUser.name[0]}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "#1a0a00" }}>
                            {currentUser.name}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm px-2.5 py-0.5 rounded-full capitalize font-medium"
                                style={{ background: "rgba(249,115,22,0.1)", color: "#f97316" }}>
                                {currentUser.role}
                            </span>
                            {currentUser.verified && (
                                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#16a34a" }}>
                                    <Check size={11} /> Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Profile & Saved Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Info */}
                        <div className="p-6 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.1)" }}>
                            <div className="flex items-center gap-2 mb-5">
                                <Edit3 size={15} style={{ color: "#f97316" }} />
                                <h2 className="text-base font-bold" style={{ color: "#1a0a00", fontFamily: "'Outfit',sans-serif" }}>
                                    Personal Information
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "#92400e" }}>
                                        <User size={11} /> Full Name
                                    </label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                        style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(249,115,22,0.2)", color: "#1a0a00" }}
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "#92400e" }}>
                                        <Mail size={11} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                        style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(249,115,22,0.2)", color: "#1a0a00" }}
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "#92400e" }}>
                                        <Phone size={11} /> Phone Number
                                    </label>
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                        style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(249,115,22,0.2)", color: "#1a0a00" }}
                                    />
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                                    style={{ background: saved ? "rgba(22,163,74,0.1)" : "linear-gradient(135deg,#f97316,#ef4444)", color: saved ? "#16a34a" : "#fff" }}
                                >
                                    {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
                                </button>
                            </div>
                        </div>

                        {/* Saved Payment */}
                        <div className="p-6 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.1)" }}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <CreditCard size={15} style={{ color: "#f97316" }} />
                                    <h2 className="text-base font-bold" style={{ color: "#1a0a00", fontFamily: "'Outfit',sans-serif" }}>
                                        Saved Payment Methods
                                    </h2>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { brand: "Visa", last4: "4242", expiry: "12/27", color: "#1a56db" },
                                    { brand: "Mastercard", last4: "5555", expiry: "08/26", color: "#d97706" },
                                ].map((card) => (
                                    <div key={card.last4} className="flex items-center justify-between p-4 rounded-xl"
                                        style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(249,115,22,0.1)" }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-7 rounded-md flex items-center justify-center text-xs font-black"
                                                style={{ background: card.color, color: "#fff" }}>
                                                {card.brand[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: "#1a0a00" }}>
                                                    {card.brand} •••• {card.last4}
                                                </p>
                                                <p className="text-xs" style={{ color: "#78716c" }}>Expires {card.expiry}</p>
                                            </div>
                                        </div>
                                        <button className="text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", color: "#dc2626" }}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                                    style={{ border: "1.5px dashed rgba(249,115,22,0.25)", color: "#f97316", background: "transparent" }}>
                                    + Add New Card
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Notifications & Actions */}
                    <div className="space-y-6">
                        {/* Notification Preferences */}
                        <div className="p-5 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.1)" }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Bell size={14} style={{ color: "#f97316" }} />
                                <h2 className="text-sm font-bold" style={{ color: "#1a0a00" }}>Notification Preferences</h2>
                            </div>
                            <div className="space-y-3">
                                {Object.entries(notifs).map(([key, val]) => {
                                    const labels: Record<string, string> = {
                                        bookingConfirm: "Booking Confirmations",
                                        eventReminders: "Event Reminders",
                                        refundUpdates: "Refund Updates",
                                        promotions: "Promotional Offers",
                                        newEvents: "New Events Nearby",
                                        priceDrops: "Price Drops",
                                    };
                                    return (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-xs" style={{ color: "#1a0a00" }}>{labels[key]}</span>
                                            <button
                                                onClick={() => setNotifs(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                                                className="w-10 h-5 rounded-full relative transition-all duration-300"
                                                style={{ background: val ? "linear-gradient(135deg,#f97316,#ef4444)" : "rgba(249,115,22,0.15)" }}
                                            >
                                                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                                                    style={{ left: val ? "calc(100% - 18px)" : "2px" }} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="p-5 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.1)" }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Shield size={14} style={{ color: "#f97316" }} />
                                <h2 className="text-sm font-bold" style={{ color: "#1a0a00" }}>Account</h2>
                            </div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowSupport(true)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-[rgba(249,115,22,0.04)]"
                                    style={{ color: "#1a0a00" }}
                                >
                                    <span className="flex items-center gap-2"><MessageSquare size={13} style={{ color: "#7c3aed" }} /> Contact Support</span>
                                    <ChevronRight size={13} style={{ color: "#78716c" }} />
                                </button>
                                <button
                                    onClick={() => { logout(); navigate("/login"); }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-red-50"
                                    style={{ color: "#dc2626" }}
                                >
                                    <span className="flex items-center gap-2"><LogOut size={13} /> Sign Out</span>
                                    <ChevronRight size={13} style={{ color: "#78716c" }} />
                                </button>
                                <button
                                    onClick={() => setShowDelete(true)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-red-50"
                                    style={{ color: "#dc2626" }}
                                >
                                    <span className="flex items-center gap-2"><Trash2 size={13} /> Delete Account</span>
                                    <ChevronRight size={13} style={{ color: "#78716c" }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}>
                    <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--color-bg-panel)", border: "1px solid rgba(248,113,113,0.3)" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={18} style={{ color: "#dc2626" }} />
                                <h2 className="text-base font-bold" style={{ color: "#1a0a00" }}>Delete Account</h2>
                            </div>
                            <button onClick={() => { setShowDelete(false); setDeleteInput(""); }}><X size={18} style={{ color: "#78716c" }} /></button>
                        </div>
                        <p className="text-sm mb-4" style={{ color: "#78716c" }}>
                            This action is permanent and cannot be undone. All your data, bookings, and tickets will be deleted.
                        </p>
                        <p className="text-xs font-medium mb-2" style={{ color: "#92400e" }}>
                            Type <strong>DELETE</strong> to confirm:
                        </p>
                        <input
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder="DELETE"
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4"
                            style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(248,113,113,0.3)", color: "#1a0a00" }}
                        />
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deleteInput !== "DELETE"}
                            className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                            style={{
                                background: deleteInput === "DELETE" ? "rgba(220,38,38,0.9)" : "rgba(220,38,38,0.2)",
                                color: "#fff",
                            }}
                        >
                            Permanently Delete Account
                        </button>
                    </div>
                </div>
            )}

            {/* Contact Support Modal */}
            {showSupport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}>
                    <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--color-bg-panel)", border: "1px solid rgba(249,115,22,0.25)" }}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={18} style={{ color: "#7c3aed" }} />
                                <h2 className="text-base font-bold" style={{ color: "#1a0a00" }}>Contact Support</h2>
                            </div>
                            <button onClick={() => setShowSupport(false)}><X size={18} style={{ color: "#78716c" }} /></button>
                        </div>
                        {supportSent ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "rgba(249,115,22,0.1)", border: "2px solid #f97316" }}>
                                    <Check size={28} style={{ color: "#f97316" }} />
                                </div>
                                <p className="font-bold" style={{ color: "#1a0a00" }}>Message Sent!</p>
                                <p className="text-sm mt-1" style={{ color: "#78716c" }}>We'll respond within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSupportSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#92400e" }}>Subject</label>
                                    <select className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                        style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(249,115,22,0.2)", color: "#1a0a00" }}>
                                        <option>Booking Issue</option>
                                        <option>Refund Request</option>
                                        <option>Technical Problem</option>
                                        <option>Account Issue</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#92400e" }}>Message</label>
                                    <textarea
                                        rows={4}
                                        value={supportMsg}
                                        onChange={(e) => setSupportMsg(e.target.value)}
                                        required
                                        placeholder="Describe your issue..."
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                                        style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(249,115,22,0.2)", color: "#1a0a00" }}
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm"
                                    style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff" }}>
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
