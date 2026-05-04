import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, Ticket } from "lucide-react";
import { useCart } from "../store";

export function CheckoutSuccess() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { clearCart } = useCart();
    const sessionId = params.get("session_id");

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--color-bg-base)" }} className="flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(249,115,22,0.18)", border: "2px solid #f97316" }}>
                    <CheckCircle size={36} style={{ color: "#f97316" }} />
                </div>
                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Outfit',sans-serif", color: "#1a0a00" }}>Payment Successful!</h1>
                <p className="text-sm mb-6" style={{ color: "#78716c" }}>Your tickets have been confirmed. A receipt has been sent to your email by Stripe.</p>

                <div className="p-6 rounded-2xl mb-6" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.25)" }}>
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>Your QR Ticket</p>
                    <div
                        className="w-32 h-32 mx-auto rounded-xl flex items-center justify-center mb-3"
                        style={{
                            background: "linear-gradient(135deg, rgba(74,222,128,0.1), rgba(74,222,128,0.05))",
                            border: "2px solid rgba(74,222,128,0.3)",
                            backgroundImage: `repeating-linear-gradient(0deg,rgba(74,222,128,0.1) 0,rgba(74,222,128,0.1) 2px,transparent 0,transparent 8px),repeating-linear-gradient(90deg,rgba(74,222,128,0.1) 0,rgba(74,222,128,0.1) 2px,transparent 0,transparent 8px)`,
                        }}
                    >
                        <Ticket size={32} style={{ color: "#f97316" }} />
                    </div>
                    {sessionId && (
                        <p className="text-[10px] font-mono break-all px-4" style={{ color: "#78716c" }}>{sessionId}</p>
                    )}
                </div>

                <div className="flex gap-3 justify-center">
                    <button onClick={() => navigate("/my-tickets")} className="px-6 py-3 rounded-xl font-bold text-sm" style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff8f4" }}>
                        View My Tickets
                    </button>
                    <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl font-medium text-sm" style={{ background: "var(--color-bg-card)", border: "1px solid rgba(249,115,22,0.2)", color: "#92400e" }}>
                        Discover More
                    </button>
                </div>
            </div>
        </div>
    );
}
