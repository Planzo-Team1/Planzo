import React from "react";
import { MapPin, RefreshCcw, Plus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function QuickActions({ onUseLocation }: { onUseLocation: () => void }) {
  return (
    <Card className="bg-panel-variant">
      <CardContent className="space-y-6">
        <h2 className="text-2xl md:text-[24px] font-semibold text-text-primary">
          Quick actions
        </h2>
        
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full h-12 justify-start gap-3 font-bold" 
            onClick={onUseLocation}
          >
            <MapPin className="w-5 h-5" />
            Use my location
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 justify-start gap-3 font-semibold"
          >
            <RefreshCcw className="w-5 h-5" />
            Refresh results
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 justify-start gap-3 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create an event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
