import { Activity } from "lucide-react";

export function EliteLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow glow-primary">
        <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/20" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="font-mono text-sm font-bold tracking-[0.2em] text-foreground">
            ELITE<span className="text-gradient">SCAN</span>
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            GM Diagnostics
          </div>
        </div>
      )}
    </div>
  );
}
