import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

interface QrScannerProps {
    onResult: (text: string) => void;
    paused?: boolean;
}

export function QrScanner({ onResult, paused }: QrScannerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const lastResultRef = useRef<{ text: string; at: number } | null>(null);
    const onResultRef = useRef(onResult);
    const [error, setError] = useState<string | null>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    const stop = () => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        setActive(false);
    };

    const start = async () => {
        setError(null);
        if (!navigator.mediaDevices?.getUserMedia) {
            setError("Camera API not available in this browser.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } },
                audio: false,
            });
            streamRef.current = stream;
            const video = videoRef.current;
            if (!video) return;
            video.srcObject = stream;
            video.setAttribute("playsinline", "true");
            await video.play();
            setActive(true);
            tick();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not access camera");
            stop();
        }
    };

    const tick = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) {
            rafRef.current = requestAnimationFrame(tick);
            return;
        }
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
            rafRef.current = requestAnimationFrame(tick);
            return;
        }
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) {
            rafRef.current = requestAnimationFrame(tick);
            return;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
            rafRef.current = requestAnimationFrame(tick);
            return;
        }
        ctx.drawImage(video, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const code = jsQR(imageData.data, w, h, { inversionAttempts: "dontInvert" });
        if (code?.data) {
            const now = Date.now();
            const last = lastResultRef.current;
            if (!last || last.text !== code.data || now - last.at > 1500) {
                lastResultRef.current = { text: code.data, at: now };
                onResultRef.current(code.data);
            }
        }
        rafRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        if (paused) {
            stop();
            return;
        }
        start();
        return () => stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused]);

    return (
        <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden" style={{ background: "#000", aspectRatio: "1 / 1", border: "1px solid rgba(249,115,22,0.25)" }}>
                <video ref={videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                {!active && !error && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                        <Camera size={20} className="mr-2" /> Starting camera…
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs p-6 text-center">
                        <CameraOff size={28} className="mb-2" />
                        <p>{error}</p>
                    </div>
                )}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-2/3 h-2/3 rounded-2xl" style={{ border: "2px solid rgba(249,115,22,0.65)", boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)" }} />
                </div>
            </div>
            <div className="flex justify-center">
                <button type="button" onClick={() => { stop(); start(); }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" }}>
                    <RefreshCw size={12} /> Restart camera
                </button>
            </div>
        </div>
    );
}
