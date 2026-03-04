import React from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ResultsArea({ isEmpty, onUseLocation }: { isEmpty: boolean; onUseLocation: () => void }) {
  if (isEmpty) {
    return (
      <Card className="flex flex-col items-center justify-center py-20 border-dashed border-2 border-white/[0.04] bg-transparent">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-surface-700 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-muted-text" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-text-primary">Set your location to search</h3>
            <p className="text-sm text-muted-text max-w-xs mx-auto">
              We need to know where you are to find events nearby. Your location data is never shared.
            </p>
          </div>
          <Button onClick={onUseLocation} className="font-bold">
            Use my location
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EventCard 
        title="Creative Morning: Digital Art"
        time="Today, 10:00 AM"
        price="Free"
        distance="2.4 km"
        image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
        tags={["Art", "Workshop"]}
        soon
      />
      <EventCard 
        title="Jazz Under the Stars"
        time="Today, 8:00 PM"
        price="$15"
        distance="1.1 km"
        image="https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800"
        tags={["Music", "Jazz"]}
      />
      <EventCard 
        title="Sunset Rooftop Yoga"
        time="Tomorrow, 6:00 PM"
        price="$25"
        distance="3.8 km"
        image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
        tags={["Health", "Yoga"]}
      />
      <EventCard 
        title="Local Craft Beer Festival"
        time="Sat, 2:00 PM"
        price="$30"
        distance="5.0 km"
        image="https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&q=80&w=800"
        tags={["Social", "Drinks"]}
      />
    </div>
  );
}

function EventCard({ title, time, price, distance, image, tags, soon }: any) {
  return (
    <Card className="group hover:border-accent-orange/30 transition-all cursor-pointer">
      <div className="aspect-video relative overflow-hidden">
        <ImageWithFallback 
          src={image} 
          alt={title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {soon && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-accent-orange text-[10px] font-bold text-background-900 rounded uppercase tracking-wider">
            Starting soon
          </div>
        )}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md text-xs font-bold text-white rounded">
          {price}
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-accent-orange uppercase tracking-wide">{time}</p>
            <p className="text-[10px] font-bold text-muted-text uppercase">{distance}</p>
          </div>
          <h4 className="text-lg font-bold text-text-primary line-clamp-1">{title}</h4>
        </div>
        <div className="flex gap-2">
          {tags.map((tag: string) => (
            <span key={tag} className="text-[10px] font-semibold text-muted-text bg-surface-700 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
