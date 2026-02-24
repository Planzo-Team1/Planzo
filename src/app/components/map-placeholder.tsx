import React from "react";
import { Card } from "./ui/card";

export function MapPlaceholder() {
  return (
    <Card className="h-[400px] relative overflow-hidden bg-surface-700">
      <div 
        className="absolute inset-0 opacity-20 grayscale"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background-900 via-transparent to-transparent" />
      
      <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
        <div className="space-y-3 bg-background-900/80 backdrop-blur-md p-6 rounded-xl border border-white/[0.04] max-w-xs shadow-2xl">
          <p className="text-xs font-mono text-muted-text leading-relaxed">
            Map disabled. <br />
            <span className="text-accent-orange font-bold">VITE_GOOGLE_MAPS_API_KEY</span> <br />
            in <span className="text-white">apps/web/.env</span> to enable.
          </p>
        </div>
      </div>
    </Card>
  );
}
