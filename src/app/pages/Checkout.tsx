import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ShieldCheck, CreditCard, Lock, CheckCircle, ArrowLeft, Ticket } from "lucide-react";
import { useCart } from "../store";

export function Checkout() {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCart();
    const [form, setForm] = useState({ name: "", email: "", card: "", expiry: "", cvc: "" });
    const [step, setStep] = useState<"form" | "success">("form");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            clearCart();
            setStep("success");
            setLoading(false);
        }, 1500);
    };

    if (step === "success") {
        return (
            <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }} className="flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(74,222,128,0.15)", border: "2px solid #4ade80" }}>
                        <CheckCircle size={36} style={{ color: "#4ade80" }} />
                    </div>
                    <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>Booking Confirmed!</h1>
                    <p className="text-sm mb-6" style={{ color: "#5a7a65" }}>A confirmation email has been sent to your inbox. Your QR code tickets are in My Tickets.</p>

                    {/* QR Code Stub */}
                    <div className="p-6 rounded-2xl mb-6" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.2)" }}>
                        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#4ade80" }}>Your QR Ticket</p>
                        <div
                            className="w-32 h-32 mx-auto rounded-xl flex items-center justify-center mb-3"
                            style={{
                                background: "linear-gradient(135deg, rgba(74,222,128,0.1), rgba(74,222,128,0.05))",
                                border: "2px solid rgba(74,222,128,0.3)",
                                backgroundImage: `repeating-linear-gradient(0deg,rgba(74,222,128,0.1) 0,rgba(74,222,128,0.1) 2px,transparent 0,transparent 8px),repeating-linear-gradient(90deg,rgba(74,222,128,0.1) 0,rgba(74,222,128,0.1) 2px,transparent 0,transparent 8px)`,
                            }}
                        >
                            <Ticket size={32} style={{ color: "#4ade80" }} />
                        </div>
                        <p className="text-xs font-mono" style={{ color: "#5a7a65" }}>QR-PLANZO-{Math.random().toString(36).slice(2, 10).toUpperCase()}</p>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate("/my-tickets")} className="px-6 py-3 rounded-xl font-bold text-sm" style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a0f0d" }}>
                            View My Tickets
                        </button>
                        <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl font-medium text-sm" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.15)", color: "#a3e0b5" }}>
                            Discover More
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }} className="flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium mb-4" style={{ color: "#5a7a65" }}>Your cart is empty</p>
                    <Link to="/" className="px-6 py-3 rounded-xl font-bold text-sm" style={{ background: "#4ade80", color: "#0a0f0d", textDecoration: "none" }}>Browse Events</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }}>
            <div className="px-6 md:px-12 py-8 max-w-[900px] mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6" style={{ color: "#5a7a65" }}>
                    <ArrowLeft size={15} /> Back
                </button>
                <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "'Outfit',sans-serif", color: "#f0fdf4" }}>Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#5a7a65" }}>Order Summary</h2>
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.tierId} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.08)" }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: "#f0fdf4" }}>{item.eventTitle}</p>
                                        <p className="text-xs" style={{ color: "#5a7a65" }}>{item.tierName} × {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-sm" style={{ color: "#4ade80" }}>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
                            <div className="flex justify-between text-sm mb-2"><span style={{ color: "#5a7a65" }}>Subtotal</span><span style={{ color: "#a3e0b5" }}>${total.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm mb-2"><span style={{ color: "#5a7a65" }}>Booking Fee</span><span style={{ color: "#4ade80" }}>FREE</span></div>
                            <hr style={{ borderColor: "rgba(74,222,128,0.1)", margin: "8px 0" }} />
                            <div className="flex justify-between font-bold"><span style={{ color: "#f0fdf4" }}>Total</span><span style={{ color: "#4ade80" }}>${total.toFixed(2)}</span></div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#5a7a65" }}>Payment Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { id: "name", label: "Full Name", placeholder: "Alex Rivera", type: "text" },
                                { id: "email", label: "Email Address", placeholder: "alex@planzo.io", type: "email" },
                            ].map(({ id, label, placeholder, type }) => (
                                <div key={id}>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>{label}</label>
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        value={form[id as keyof typeof form]}
                                        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                        style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>
                                    <CreditCard size={13} style={{ color: "#4ade80" }} /> Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="4242 4242 4242 4242"
                                    value={form.card}
                                    onChange={(e) => setForm({ ...form, card: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                    style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>Expiry</label>
                                    <input type="text" placeholder="MM / YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3e0b5" }}>CVC</label>
                                    <input type="text" placeholder="123" value={form.cvc} onChange={(e) => setForm({ ...form, cvc: e.target.value })} required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(74,222,128,0.15)", color: "#f0fdf4" }} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a0f0d" }}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-[#0a0f0d] border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <><Lock size={14} /> Pay ${total.toFixed(2)} Securely</>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-4">
                                <ShieldCheck size={14} style={{ color: "#4ade80" }} />
                                <span className="text-xs" style={{ color: "#5a7a65" }}>256-bit SSL · Powered by Stripe</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
