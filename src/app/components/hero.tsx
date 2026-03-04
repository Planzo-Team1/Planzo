import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { Card, CardContent, Input } from "./ui/card";
import { Button } from "./ui/button";

// Wait, I put Input in card.tsx, let me fix that import.

export function Hero({ onGenerate }: { onGenerate?: () => void }) {
  return (
    <Card className="relative overflow-hidden group">
      {/* Subtle glassmorphism gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1768330005141-56b8c5ce605a?auto=format&fit=crop&q=80&w=1200')`, backgroundSize: 'cover' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-2">
          <p className="text-[12px] font-bold text-muted-text uppercase tracking-widest">
            PLANZO AI CONCIERGE
          </p>
          <h1 className="text-4xl md:text-[32px] font-bold text-text-primary leading-tight">
            Find events that match your vibe
          </h1>
          <p className="text-base text-muted-text max-w-xl">
            Describe your ideal weekend or what you're in the mood for, and let Planzo find the perfect spot.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text/50" />
            <input
              type="text"
              placeholder="Weekend events for creatives"
              className="w-full h-12 bg-surface-700 border border-input-border rounded-lg pl-11 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50 transition-all"
            />
          </div>
          <Button onClick={onGenerate} size="lg" className="h-12 px-8 font-bold">
            Generate
          </Button>
        </div>

        <div className="flex overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap gap-3 scrollbar-hide">
          <FilterChip label="Persona" />
          <FilterChip label="Time window" />
          <FilterChip label="Budget" />
          <FilterChip label="Vibe" />
          <FilterChip label="Accessibility" />
        </div>
      </CardContent>
    </Card>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-surface-700 hover:bg-surface-800 border border-input-border rounded-full text-sm font-medium text-text-primary transition-colors cursor-pointer group/chip">
      {label}
      <ChevronDown className="w-4 h-4 text-muted-text group-hover/chip:text-text-primary transition-colors" />
    </button>
  );
}
