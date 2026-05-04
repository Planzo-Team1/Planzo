import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ShieldCheck, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { useCart } from "../store";

export function Checkout() {
    const navigate = useNavigate();
    const { items, total } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStripeCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    origin: window.location.origin,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.url) {
                throw new Error(data.error || "Failed to start checkout");
            }

            window.location.href = data.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }} className="flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium mb-4" style={{ color: "#78716c" }}>Your cart is empty</p>
                    <Link to="/" className="px-6 py-3 rounded-xl font-bold text-sm" style={{ background: "#f97316", color: "#fff8f4", textDecoration: "none" }}>Browse Events</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }}>
            <div className="px-6 md:px-12 py-8 max-w-[900px] mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6" style={{ color: "#78716c" }}>
                    <ArrowLeft size={15} /> Back
                </button>
                <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "'Outfit',sans-serif", color: "#1a0a00" }}>Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#78716c" }}>Order Summary</h2>
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.tierId} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.08)" }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: "#1a0a00" }}>{item.eventTitle}</p>
                                        <p className="text-xs" style={{ color: "#78716c" }}>{item.tierName} × {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-sm" style={{ color: "#f97316" }}>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}>
                            <div className="flex justify-between text-sm mb-2"><span style={{ color: "#78716c" }}>Subtotal</span><span style={{ color: "#92400e" }}>${total.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm mb-2"><span style={{ color: "#78716c" }}>Booking Fee</span><span style={{ color: "#f97316" }}>FREE</span></div>
                            <hr style={{ borderColor: "rgba(74,222,128,0.1)", margin: "8px 0" }} />
                            <div className="flex justify-between font-bold"><span style={{ color: "#1a0a00" }}>Total</span><span style={{ color: "#f97316" }}>${total.toFixed(2)}</span></div>
                        </div>
                    </div>

                    {/* Payment Action */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#78716c" }}>Pay with Stripe</h2>
                        <div className="p-6 rounded-2xl" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.2)" }}>
                            <p className="text-sm mb-6" style={{ color: "#78716c" }}>
                                You'll be redirected to Stripe's secure checkout to complete your payment. Use card <span className="font-mono font-bold" style={{ color: "#1a0a00" }}>4242 4242 4242 4242</span> for testing.
                            </p>

                            {error && (
                                <div className="flex items-start gap-2 p-3 rounded-lg mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
                                    <AlertCircle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />
                                    <p className="text-xs" style={{ color: "#991b1b" }}>{error}</p>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleStripeCheckout}
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff8f4", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-[#fff8f4] border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <><Lock size={14} /> Pay ${total.toFixed(2)} with Stripe</>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-4">
                                <ShieldCheck size={14} style={{ color: "#f97316" }} />
                                <span className="text-xs" style={{ color: "#78716c" }}>256-bit SSL · Powered by Stripe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
