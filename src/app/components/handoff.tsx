import React from "react";
import { Card, CardContent } from "./ui/card";

export function Handoff() {
  return (
    <div className="mt-20 border-t border-white/[0.04] pt-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Dev Handoff</h2>
        <p className="text-muted-text">Design tokens and component documentation for implementation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-panel-variant">
          <CardContent className="space-y-6">
            <h3 className="text-xl font-bold">CSS Tokens</h3>
            <pre className="bg-background-900 p-4 rounded-lg text-xs text-accent-orange overflow-x-auto">
{`:root {
  --bg-900: #0b0b0c;
  --surface-800: #121214;
  --panel: #111112;
  --text-primary: #ffffff;
  --muted-text: #a6a6a8;
  --accent: #ff9f1c;
  --radius: 12px;
  --spacing-base: 4px;
  --font-primary: 'Inter', sans-serif;
}`}
            </pre>
          </CardContent>
        </Card>

        <Card className="bg-panel-variant">
          <CardContent className="space-y-6">
            <h3 className="text-xl font-bold">Tailwind Suggestions</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                <span className="text-sm text-muted-text">Accent</span>
                <span className="text-sm font-mono text-white">amber-500</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                <span className="text-sm text-muted-text">Surface</span>
                <span className="text-sm font-mono text-white">zinc-900</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                <span className="text-sm text-muted-text">Gutter</span>
                <span className="text-sm font-mono text-white">24px (gap-6)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                <span className="text-sm text-muted-text">Columns</span>
                <span className="text-sm font-mono text-white">12 col grid</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
