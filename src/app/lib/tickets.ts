import QRCode from "qrcode";

export interface IssuedTicket {
    id: string;
    bookingId: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventVenue: string;
    tierId: string;
    tierName: string;
    price: number;
    userId: string;
    userName: string;
    qrPayload: string;
    qrDataUrl: string;
    status: "valid" | "checked_in" | "cancelled";
    issuedAt: string;
    checkedInAt?: string;
    stripeSessionId?: string;
}

interface TicketPayloadCore {
    v: 1;
    id: string;
    bookingId: string;
    eventId: string;
    userId: string;
    issuedAt: number;
}

export interface TicketPayload extends TicketPayloadCore {
    sig: string;
}

const SECRET = "planzo-demo-secret-v1";

function utf8ToBytes(s: string): Uint8Array {
    return new TextEncoder().encode(s);
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fnv1a(bytes: Uint8Array): string {
    let h = 0x811c9dc5;
    for (let i = 0; i < bytes.length; i++) {
        h ^= bytes[i];
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(16).padStart(8, "0");
}

function sign(core: TicketPayloadCore): string {
    const canonical = `${core.v}|${core.id}|${core.bookingId}|${core.eventId}|${core.userId}|${core.issuedAt}|${SECRET}`;
    return fnv1a(utf8ToBytes(canonical));
}

export function buildTicketPayload(core: TicketPayloadCore): string {
    const sig = sign(core);
    return JSON.stringify({ ...core, sig });
}

export function verifyTicketPayload(raw: string): { ok: true; payload: TicketPayload } | { ok: false; reason: string } {
    let parsed: TicketPayload;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return { ok: false, reason: "Not a valid Planzo ticket QR" };
    }
    if (!parsed || parsed.v !== 1 || !parsed.id || !parsed.sig) {
        return { ok: false, reason: "Unrecognized ticket format" };
    }
    const expected = sign({
        v: 1,
        id: parsed.id,
        bookingId: parsed.bookingId,
        eventId: parsed.eventId,
        userId: parsed.userId,
        issuedAt: parsed.issuedAt,
    });
    if (expected !== parsed.sig) {
        return { ok: false, reason: "Signature mismatch — ticket is not authentic" };
    }
    return { ok: true, payload: parsed };
}

export async function renderQrDataUrl(payload: string): Promise<string> {
    return QRCode.toDataURL(payload, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 320,
        color: { dark: "#1a0a00", light: "#ffffff" },
    });
}

export function newId(prefix: string): string {
    const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${rand}`;
}
