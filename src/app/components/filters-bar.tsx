import React from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function FiltersBar() {
  return (
    <Card className="bg-panel">
      <CardContent className="py-4 px-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text-primary whitespace-nowrap">Radius</span>
            <div className="flex items-center bg-surface-700 border border-input-border rounded-lg px-3 py-2">
              <input 
                type="number" 
                defaultValue={10} 
                className="w-10 bg-transparent text-sm text-text-primary focus:outline-none"
              />
              <span className="text-sm text-muted-text">km</span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/[0.04] hidden md:block" />

          <DropdownFilter label="Category" value="All categories" />
          <DropdownFilter label="Price" value="Any price" />

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="soon" 
              className="w-4 h-4 rounded border-input-border bg-surface-700 text-accent-orange focus:ring-accent-orange/50 transition-all cursor-pointer" 
            />
            <label htmlFor="soon" className="text-sm font-medium text-text-primary cursor-pointer">
              Starting soon (6h)
            </label>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text-primary">Location</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-700 border border-input-border rounded-lg min-w-[140px]">
              <MapPin className="w-4 h-4 text-muted-text" />
              <span className="text-sm text-muted-text flex-1">Not set</span>
              <button className="text-xs font-bold text-accent-orange hover:text-accent-orange-2 transition-colors px-2 py-1 rounded bg-accent-orange/10">
                Set
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DropdownFilter({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <span className="text-sm font-semibold text-text-primary">{label}</span>
      <div className="flex items-center gap-2 text-sm text-muted-text group-hover:text-text-primary transition-colors">
        {value}
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
