import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserPlus, Eye, EyeOff, Zap } from "lucide-react";
import { useAuth } from "../store";
import type { Role } from "../mock-data";

const ROLES: { value: Role; label: string; desc: string; color: string }[] = [
    { value: "attendee", label: "Attendee", desc: "Browse & book events", color: "#4ade80" },
    { value: "organizer", label: "Organizer", desc: "Create & manage events", color: "#60a5fa" },
    { value: "finance", label: "Finance", desc: "Revenue & payouts", color: "#fbbf24" },
    { value: "marketing", label: "Marketing", desc: "Campaigns & promotions", color: "#c084fc" },
];

export function AuthRegister() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState<Role>("attendee");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            // Demo: log in as the matching role
            login("", "", role);
            navigate("/");
        }, 1200);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-bg-base)" }} className="flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-[460px]">
                {/* Logo */}
                <div className="flex items-center gap-2 justify-center mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)" }}>
                        <Zap size={20} color="#0a0f0d" strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>
                        Plan<span style={{ color: "#4ade80" }}>zo</span>
                    </span>
                </div>

                <div className="p-8 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.15)" }}>
                    <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>Create your account</h1>
                    <p className="text-sm mb-6" style={{ color: "#5a7a65" }}>Join Planzo today — free for attendees</p>

                    {/* Role Selector */}
                    <div className="mb-5">
                        <p className="text-xs font-medium mb-2" style={{ color: "#a3e0b5" }}>I am a…</p>
                        <div className="grid grid-cols-2 gap-2">
                            {ROLES.map((r) => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => setRole(r.value)}
                                    className="p-3 rounded-xl text-left transition-all"
                                    style={{
                                        background: role === r.value ? `${r.color}12` : "var(--color-bg-raised)",
                                        border: `1px solid ${role === r.value ? r.color : "rgba(74,222,128,0.1)"}`,
                                    }}
                                >
                                    <p className="text-xs font-bold mb-0.5" style={{ color: role === r.value ? r.color : "#f0fdf4" }}>{r.label}</p>
                                    <p className="text-xs" style={{ color: "#5a7a65" }}>{r.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>Full Name</label>
                            <input type="text" placeholder="Alex Rivera" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>Email Address</label>
                            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>Password</label>
                            <div className="relative">
                                <input type={show ? "text" : "password"} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-10" style={{ background: "var(--color-bg-raised)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }} />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShow(!show)} style={{ color: "#5a7a65" }}>
                                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all" style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a0f0d" }}>
                            {loading ? <div className="w-4 h-4 border-2 border-[#0a0f0d] border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={14} /> Create Account</>}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-5" style={{ color: "#5a7a65" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#4ade80", textDecoration: "none" }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
