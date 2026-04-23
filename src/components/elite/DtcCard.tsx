import { motion } from "framer-motion";
import { AlertTriangle, Wrench, Lightbulb, ChevronRight } from "lucide-react";
import type { DtcInfo } from "@/lib/gm-dtc";
import { useState } from "react";

const SEVERITY = {
  low: { label: "Low", bg: "bg-success/10", text: "text-success", border: "border-success/30" },
  medium: {
    label: "Medium",
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
  },
  high: {
    label: "Critical",
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/40",
  },
} as const;

export function DtcCard({ dtc, index = 0 }: { dtc: DtcInfo; index?: number }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY[dtc.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`group overflow-hidden rounded-xl border ${sev.border} bg-card/60 backdrop-blur transition-shadow hover:shadow-[0_0_30px_-15px_var(--primary)]`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${sev.bg}`}
        >
          <AlertTriangle className={`h-5 w-5 ${sev.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold tracking-wider text-foreground">
              {dtc.code}
            </span>
            <span
              className={`rounded-full ${sev.bg} ${sev.text} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}
            >
              {sev.label}
            </span>
            <span className="hidden rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
              {dtc.system}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{dtc.title}</p>
        </div>
        <ChevronRight
          className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="grid gap-4 border-t border-border/60 p-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Lightbulb className="h-3.5 w-3.5" />
              Simple Explanation
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{dtc.explanation}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Wrench className="h-3.5 w-3.5" />
              Potential Fix
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{dtc.fix}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
