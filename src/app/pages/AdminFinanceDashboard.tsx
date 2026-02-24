import React, { useState } from "react";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { MOCK_REVENUE } from "../mock-data";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const revenueTimeline = [
    { month: "Sep", gross: 98000, net: 88200 }, { month: "Oct", gross: 134000, net: 120600 },
    { month: "Nov", gross: 156000, net: 140400 }, { month: "Dec", gross: 212000, net: 190800 },
    { month: "Jan", gross: 178000, net: 160200 }, { month: "Feb", gross: 240000, net: 216000 },
];

export function AdminFinanceDashboard() {
    const [search, setSearch] = useState("");

    const totalGross = MOCK_REVENUE.reduce((s, r) => s + r.gross, 0);
    const totalCommission = MOCK_REVENUE.reduce((s, r) => s + r.commission, 0);
    const totalPayout = MOCK_REVENUE.reduce((s, r) => s + r.payout, 0);
    const pendingCount = MOCK_REVENUE.filter((r) => r.status === "pending").length;

    const filtered = MOCK_REVENUE.filter(
        (r) => r.eventTitle.toLowerCase().includes(search.toLowerCase()) || r.organizer.toLowerCase().includes(search.toLowerCase())
    );

    const statusStyle = (s: string) => {
        if (s === "paid") return { bg: "rgba(74,222,128,0.1)", color: "#4ade80", icon: CheckCircle };
        if (s === "processing") return { bg: "rgba(96,165,250,0.1)", color: "#60a5fa", icon: Clock };
        return { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", icon: AlertCircle };
    };

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }}>
            <div className="px-6 md:px-12 py-8 max-w-[1200px] mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>Finance Dashboard</h1>
                    <p className="text-sm" style={{ color: "#5a7a65" }}>Revenue tracking, commission management, and organizer payouts</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Gross Revenue", value: `$${(totalGross / 1000).toFixed(0)}K`, sub: "All ticket sales", color: "#4ade80", change: "+23%" },
                        { label: "Platform Commission", value: `$${(totalCommission / 1000).toFixed(0)}K`, sub: "10% avg rate", color: "#60a5fa", change: "+23%" },
                        { label: "Organizer Payouts", value: `$${(totalPayout / 1000).toFixed(0)}K`, sub: "Net to organizers", color: "#c084fc", change: "+22%" },
                        { label: "Pending Payouts", value: pendingCount, sub: "Awaiting approval", color: "#fbbf24", change: "—" },
                    ].map(({ label, value, sub, color, change }) => (
                        <div key={label} className="p-5 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "#5a7a65" }}>{label}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-bold" style={{ color, fontFamily: "'Outfit',sans-serif" }}>{value}</p>
                                {change !== "—" && (
                                    <span className="text-xs flex items-center gap-0.5" style={{ color: "#4ade80" }}>
                                        <ArrowUpRight size={11} />{change}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs mt-1" style={{ color: "#5a7a65" }}>{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Revenue Chart */}
                <div className="p-6 rounded-2xl mb-8" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                    <h2 className="text-base font-bold mb-6" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>
                        <TrendingUp size={16} className="inline mr-2" style={{ color: "#4ade80" }} />
                        Platform Revenue (6 Months)
                    </h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={revenueTimeline}>
                            <defs>
                                <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5a7a65" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#5a7a65" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip contentStyle={{ background: "#152018", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, color: "#f0fdf4" }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                            <Area type="monotone" dataKey="gross" stroke="#4ade80" strokeWidth={2} fill="url(#grossGrad)" name="Gross Revenue" dot={{ r: 3, fill: "#4ade80" }} />
                            <Area type="monotone" dataKey="net" stroke="#60a5fa" strokeWidth={2} fill="url(#netGrad)" name="Net Payouts" dot={{ r: 3, fill: "#60a5fa" }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Table */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                    <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(74,222,128,0.08)" }}>
                        <h2 className="text-base font-bold" style={{ color: "#f0fdf4", fontFamily: "'Outfit',sans-serif" }}>Transaction Ledger</h2>
                        <input
                            placeholder="Search events or organizers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-3 py-2 rounded-xl text-xs outline-none w-56"
                            style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(74,222,128,0.06)" }}>
                                    {["Event", "Organizer", "Gross", "Commission", "Payout", "Date", "Status"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color: "#5a7a65" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => {
                                    const sc = statusStyle(r.status);
                                    const StatusIcon = sc.icon;
                                    return (
                                        <tr key={r.id} className="hover:bg-[rgba(74,222,128,0.02)] transition-colors" style={{ borderBottom: "1px solid rgba(74,222,128,0.04)" }}>
                                            <td className="px-4 py-3 font-medium text-sm" style={{ color: "#f0fdf4" }}>{r.eventTitle}</td>
                                            <td className="px-4 py-3 text-xs" style={{ color: "#a3e0b5" }}>{r.organizer}</td>
                                            <td className="px-4 py-3 text-xs font-bold" style={{ color: "#f0fdf4" }}>${r.gross.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs font-medium" style={{ color: "#60a5fa" }}>${r.commission.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs font-bold" style={{ color: "#4ade80" }}>${r.payout.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs" style={{ color: "#5a7a65" }}>{r.date}</td>
                                            <td className="px-4 py-3">
                                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium w-fit capitalize" style={{ background: sc.bg, color: sc.color }}>
                                                    <StatusIcon size={10} /> {r.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
