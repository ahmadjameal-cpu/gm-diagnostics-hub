import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ScanLine, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { ALL_DTC_CODES, GM_DTC, lookupDtc, type DtcInfo } from "@/lib/gm-dtc";
import { DtcCard } from "@/components/elite/DtcCard";
import { appStore, useAppState } from "@/lib/app-store";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Trouble Code Scanner — EliteScan" },
      {
        name: "description",
        content:
          "Scan your GM vehicle for diagnostic trouble codes (DTCs) with simple explanations and potential fixes. Includes GM-specific P1xxx codes.",
      },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  const { activeCodes, demoMode, status } = useAppState();
  const [scanning, setScanning] = useState(false);

  const runScan = async () => {
    setScanning(true);
    // Simulate ECM communication delay
    await new Promise((r) => setTimeout(r, 1800));

    let foundCodes: DtcInfo[];
    if (demoMode || status !== "connected") {
      // Pick a realistic random subset of 0-4 codes biased toward common GM faults
      const pool = ALL_DTC_CODES;
      const count = Math.floor(Math.random() * 4) + 1;
      const picked = new Set<string>();
      while (picked.size < count) {
        picked.add(pool[Math.floor(Math.random() * pool.length)]);
      }
      foundCodes = Array.from(picked).map((c) => GM_DTC[c]);
    } else {
      // Real scan would go here. For now, no codes.
      foundCodes = [];
    }

    appStore.recordScan(foundCodes);
    setScanning(false);
  };

  const clear = () => appStore.clearActive();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Trouble Code <span className="text-gradient">Scanner</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reads Mode 03 stored DTCs and decodes them with GM manufacturer intelligence.
        </p>
      </div>

      {/* Scan control panel */}
      <motion.div
        layout
        className="scanline glass relative overflow-hidden rounded-2xl p-6"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <ScanLine className="h-6 w-6 text-primary" />
              {scanning && (
                <div className="absolute inset-0 animate-ping rounded-xl bg-primary/20" />
              )}
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {scanning ? "Scanning ECM…" : "Ready to Scan"}
              </div>
              <div className="text-lg font-bold text-foreground">
                GM Diagnostic Module
              </div>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            {activeCodes.length > 0 && (
              <button
                onClick={clear}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={runScan}
              disabled={scanning}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground glow-primary transition-transform hover:scale-[1.02] disabled:opacity-60 sm:flex-none"
            >
              {scanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Scanning
                </>
              ) : (
                <>
                  <ScanLine className="h-4 w-4" /> Scan for Codes
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center"
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Querying ECM · GMLAN bus · Mode 03
              </div>
            </motion.div>
          ) : activeCodes.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-foreground">
                  {activeCodes.length} Active{" "}
                  {activeCodes.length === 1 ? "Code" : "Codes"} Detected
                </h2>
              </div>
              {activeCodes.map((dtc, i) => (
                <DtcCard key={dtc.code + i} dtc={dtc} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* GM code coverage */}
      <section className="mt-12">
        <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-foreground">
          GM Code Coverage Preview
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          A peek at the GM-specific manufacturer codes EliteScan can decode.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(GM_DTC)
            .filter((c) => c.code.startsWith("P1"))
            .map((c) => (
              <div
                key={c.code}
                className="rounded-lg border border-border bg-card/60 p-3 backdrop-blur"
              >
                <div className="font-mono text-sm font-bold text-primary">{c.code}</div>
                <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {c.title}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Lookup helper */}
      <ManualLookup />
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
        <ShieldCheck className="h-7 w-7 text-success" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-foreground">No Active Codes</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Run a scan to read your GM vehicle's stored diagnostic trouble codes.
      </p>
    </motion.div>
  );
}

function ManualLookup() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<DtcInfo | null>(null);

  return (
    <section className="mt-12">
      <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-foreground">
        Manual Code Lookup
      </h2>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setResult(lookupDtc(code))}
          placeholder="e.g. P0420"
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={() => setResult(lookupDtc(code))}
          className="rounded-xl bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary-glow"
        >
          Decode
        </button>
      </div>
      {result && (
        <div className="mt-3">
          <DtcCard dtc={result} />
        </div>
      )}
    </section>
  );
}
