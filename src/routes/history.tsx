import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, FileText, Trash2 } from "lucide-react";
import { appStore, useAppState } from "@/lib/app-store";
import { DtcCard } from "@/components/elite/DtcCard";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History — EliteScan" },
      {
        name: "description",
        content:
          "Review past OBD2 diagnostic scans. Track when codes were detected and what fixes were suggested for your GM vehicle.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history } = useAppState();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Scan <span className="text-gradient">History</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chronological log of every diagnostic session.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => appStore.clearHistory()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3 w-3" /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">No scans yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Run your first diagnostic from the Trouble Codes page to start building history.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((record, i) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em]">
                    {new Date(record.scannedAt).toLocaleString()}
                  </span>
                </div>
                <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {record.codes.length} {record.codes.length === 1 ? "code" : "codes"}
                </span>
              </div>
              {record.codes.length === 0 ? (
                <p className="text-sm text-success">
                  ✓ No trouble codes detected during this scan.
                </p>
              ) : (
                <div className="space-y-2">
                  {record.codes.map((c, idx) => (
                    <DtcCard key={c.code + idx} dtc={c} index={idx} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
