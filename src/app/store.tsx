import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, MOCK_USERS, Event, MOCK_EVENTS } from "./mock-data";
import type { Role } from "./mock-data";
import type { IssuedTicket } from "./lib/tickets";

// ─── Auth Context ─────────────────────────────────────────────────────────

interface RegisterResult {
    success: boolean;
    error?: string;
}

interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string, role?: string) => boolean;
    register: (name: string, email: string, password: string, role: Role) => RegisterResult;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Cart Context ─────────────────────────────────────────────────────────

interface CartItem {
    eventId: string;
    eventTitle: string;
    tierId: string;
    tierName: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (tierId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Events Context ───────────────────────────────────────────────────────

interface EventsContextType {
    events: Event[];
    addEvent: (event: Event) => void;
    updateEvent: (event: Event) => void;
    deleteEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

// ─── Tickets Context ──────────────────────────────────────────────────────

interface TicketsContextType {
    tickets: IssuedTicket[];
    addTickets: (tickets: IssuedTicket[]) => void;
    findTicketById: (id: string) => IssuedTicket | undefined;
    checkInTicket: (id: string) => { ok: true; ticket: IssuedTicket } | { ok: false; reason: string };
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

const TICKETS_STORAGE_KEY = "planzo:tickets:v1";

function loadTicketsFromStorage(): IssuedTicket[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(TICKETS_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as IssuedTicket[]) : [];
    } catch {
        return [];
    }
}

// ─── Providers ────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>([...MOCK_USERS]);
    const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [events, setEvents] = useState<Event[]>([...MOCK_EVENTS]);
    const [tickets, setTickets] = useState<IssuedTicket[]>(() => loadTicketsFromStorage());

    useEffect(() => {
        try {
            window.localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
        } catch {
            // ignore quota errors
        }
    }, [tickets]);

    const login = (email: string, _password: string, role?: string) => {
        const user = users.find(
            (u) => (u.email === email || (role && u.role === role)) && (!u.password || u.password === _password)
        );
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const register = (name: string, email: string, _password: string, role: Role): RegisterResult => {
        const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) return { success: false, error: "An account with this email already exists." };

        const newUser: User = {
            id: `u${Date.now()}`,
            name,
            email,
            role,
            avatar: name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
            verified: false,
        };
        setUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
        return { success: true };
    };

    const logout = () => setCurrentUser(null);

    const addItem = (item: CartItem) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.tierId === item.tierId);
            if (existing) {
                return prev.map((i) =>
                    i.tierId === item.tierId ? { ...i, quantity: item.quantity } : i
                );
            }
            return [...prev, item];
        });
    };

    const removeItem = (tierId: string) =>
        setCartItems((prev) => prev.filter((i) => i.tierId !== tierId));

    const clearCart = () => setCartItems([]);

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const addEvent = (event: Event) => setEvents(prev => [event, ...prev]);
    const updateEvent = (event: Event) => setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

    const addTickets = (newTickets: IssuedTicket[]) => {
        setTickets((prev) => {
            const seen = new Set(prev.map((t) => t.id));
            const deduped = newTickets.filter((t) => !seen.has(t.id));
            return [...deduped, ...prev];
        });
    };

    const findTicketById = (id: string) => tickets.find((t) => t.id === id);

    const checkInTicket = (id: string) => {
        const ticket = tickets.find((t) => t.id === id);
        if (!ticket) return { ok: false as const, reason: "Ticket not found" };
        if (ticket.status === "cancelled") return { ok: false as const, reason: "Ticket has been cancelled" };
        if (ticket.status === "checked_in") return { ok: false as const, reason: `Already checked in${ticket.checkedInAt ? ` at ${new Date(ticket.checkedInAt).toLocaleTimeString()}` : ""}` };
        const checkedInAt = new Date().toISOString();
        const updated: IssuedTicket = { ...ticket, status: "checked_in", checkedInAt };
        setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return { ok: true as const, ticket: updated };
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, isAuthenticated: !!currentUser }}>
            <CartContext.Provider value={{ items: cartItems, addItem, removeItem, clearCart, total }}>
                <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
                    <TicketsContext.Provider value={{ tickets, addTickets, findTicketById, checkInTicket }}>
                        {children}
                    </TicketsContext.Provider>
                </EventsContext.Provider>
            </CartContext.Provider>
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AppProvider");
    return ctx;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within AppProvider");
    return ctx;
}

export function useEvents() {
    const ctx = useContext(EventsContext);
    if (!ctx) throw new Error("useEvents must be used within AppProvider");
    return ctx;
}

export function useTickets() {
    const ctx = useContext(TicketsContext);
    if (!ctx) throw new Error("useTickets must be used within AppProvider");
    return ctx;
}
