import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, X } from "lucide-react";
import { Button } from "./ui/button";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
}

export function LocationModal({ isOpen, onClose, onAllow }: LocationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background-900/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-panel border border-white/[0.04] rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent-orange" />
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-surface-700 rounded-lg transition-colors text-muted-text hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary">Allow location access?</h3>
                <p className="text-sm text-muted-text leading-relaxed">
                  Planzo uses your location to show you events happening near you. We don't store your exact coordinate history.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Deny
                </Button>
                <Button onClick={onAllow} className="flex-1 font-bold">
                  Allow access
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
