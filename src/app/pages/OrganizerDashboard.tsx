import React, { useState } from "react";
import { Plus, Users, DollarSign, BarChart2, Edit, Trash2, Eye, Calendar, MapPin, X } from "lucide-react";
import { MOCK_EVENTS, MOCK_BOOKINGS } from "../mock-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const revenueData = [
    { month: "Jan", revenue: 12400 }, { month: "Feb", revenue: 18700 },
    { month: "Mar", revenue: 24300 }, { month: "Apr", revenue: 19800 },
    { month: "May", revenue: 31200 }, { month: "Jun", revenue: 28600 },
];

type CreateForm = { title: string; date: string; category: string; venue: string; price: string; capacity: string; description: string };
const initForm: CreateForm = { title: "", date: "", category: "Music", venue: "", price: "", capacity: "", description: "" };

export function OrganizerDashboard() {
    const [showCreate, setShowCreate] = useState(false);
    const [events, setEvents] = useState(MOCK_EVENTS.slice(0, 4));
    const [form, setForm] = useState<CreateForm>(initForm);
    const [saving, setSaving] = useState(false);

    const stats = [
        { label: "Active Events", value: events.length, icon: Calendar, color: "#4ade80" },
        { label: "Total Attendees", value: "4,280", icon: Users, color: "#60a5fa" },
        { label: "Revenue (MTD)", value: "$62,300", icon: DollarSign, color: "#fbbf24" },
        { label: "Avg. Rating", value: "4.8 ★", icon: BarChart2, color: "#c084fc" },
    ];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setShowCreate(false);
            setForm(initForm);
        }, 1000);
    };

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }}>
            <div className="px-6 md:px-12 py-8 max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>Organizer Dashboard</h1>
                        <p className="text-sm" style={{ color: "#5a7a65" }}>Create, manage, and track your events</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
                        style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a0f0d" }}
                    >
                        <Plus size={15} /> Create Event
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="p-5 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#5a7a65" }}>{label}</p>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                                    <Icon size={16} style={{ color }} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold" style={{ color, fontFamily: "'Outfit',sans-serif" }}>{value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Events Table */}
                    <div className="lg:col-span-2">
                        <h2 className="text-base font-bold mb-4" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>My Events</h2>
                        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(74,222,128,0.08)" }}>
                                        {["Event", "Date", "Tickets", "Revenue", "Actions"].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color: "#5a7a65" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgba(74,222,128,0.05)]">
                                    {events.map((event) => (
                                        <tr key={event.id} className="hover:bg-[rgba(74,222,128,0.03)] transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-sm leading-snug line-clamp-1" style={{ color: "#f0fdf4" }}>{event.title}</p>
                                                <p className="text-xs" style={{ color: "#5a7a65" }}>{event.category}</p>
                                            </td>
                                            <td className="px-4 py-3 text-xs" style={{ color: "#a3e0b5" }}>{event.date}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-medium" style={{ color: "#4ade80" }}>
                                                    {event.tiers.reduce((s, t) => s + t.total - t.remaining, 0)}/{event.tiers.reduce((s, t) => s + t.total, 0)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs font-bold" style={{ color: "#4ade80" }}>
                                                ${event.tiers.reduce((s, t) => s + (t.total - t.remaining) * t.price, 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1">
                                                    <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(74,222,128,0.08)", color: "#4ade80" }} title="View"><Eye size={12} /></button>
                                                    <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(96,165,250,0.08)", color: "#60a5fa" }} title="Edit"><Edit size={12} /></button>
                                                    <button onClick={() => setEvents(events.filter(e => e.id !== event.id))} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(248,113,113,0.08)", color: "#f87171" }} title="Delete"><Trash2 size={12} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div>
                        <h2 className="text-base font-bold mb-4" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>Revenue Trend</h2>
                        <div className="p-4 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5a7a65" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#5a7a65" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={{ background: "#152018", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, color: "#f0fdf4" }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                                    <Bar dataKey="revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recent Bookings */}
                        <h2 className="text-base font-bold mt-6 mb-3" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>Recent Bookings</h2>
                        <div className="space-y-2">
                            {MOCK_BOOKINGS.map((b) => (
                                <div key={b.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.06)" }}>
                                    <div>
                                        <p className="text-xs font-medium" style={{ color: "#f0fdf4" }}>{b.eventTitle.slice(0, 22)}…</p>
                                        <p className="text-xs" style={{ color: "#5a7a65" }}>{b.tierName} × {b.quantity}</p>
                                    </div>
                                    <p className="text-xs font-bold" style={{ color: "#4ade80" }}>${b.total}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Event Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
                    <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: "var(--color-bg-panel)", border: "1px solid rgba(74,222,128,0.2)" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>Create New Event</h2>
                            <button onClick={() => setShowCreate(false)} style={{ color: "#5a7a65" }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            {[
                                { id: "title", label: "Event Title", placeholder: "e.g. Summer Music Festival", type: "text" },
                                { id: "date", label: "Date", placeholder: "", type: "date" },
                                { id: "venue", label: "Venue", placeholder: "e.g. Central Park, NYC", type: "text" },
                                { id: "price", label: "Ticket Price ($)", placeholder: "49", type: "number" },
                                { id: "capacity", label: "Total Capacity", placeholder: "500", type: "number" },
                            ].map(({ id, label, placeholder, type }) => (
                                <div key={id}>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>{label}</label>
                                    <input type={type} placeholder={placeholder} value={form[id as keyof CreateForm]} onChange={(e) => setForm({ ...form, [id]: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }} />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }}>
                                    {["Music", "Tech", "Food", "Art", "Wellness"].map((c) => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>Description</label>
                                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }} />
                            </div>
                            <button type="submit" disabled={saving} className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a0f0d" }}>
                                {saving ? <div className="w-4 h-4 border-2 border-[#0a0f0d] border-t-transparent rounded-full animate-spin" /> : "Publish Event"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
