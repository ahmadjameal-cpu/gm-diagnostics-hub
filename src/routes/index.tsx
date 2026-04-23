import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Gauge } from "@/components/elite/Gauge";
import { useMockTelemetry } from "@/hooks/use-mock-telemetry";
import { appStore, useAppState } from "@/lib/app-store";
import { connectElm327, isWebBluetoothSupported } from "@/lib/obd2";
import {
  Activity,
  Bluetooth,
  Car,
  Cpu,
  Droplets,
  Gauge as GaugeIcon,
  ScanLine,
  Thermometer,
  TrendingUp,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Live Dashboard — EliteScan" },
      {
        name: "description",
        content:
          "Real-time OBD2 telemetry dashboard for GM vehicles. RPM, speed, coolant temperature, and fuel trim with live animated gauges.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { status, demoMode, errorMessage } = useAppState();
  const live = useMockTelemetry(demoMode);

  const handleConnect = async () => {
    appStore.setDemoMode(false);
    appStore.setStatus("searching");
    try {
      appStore.setStatus("connecting");
      await connectElm327();
      appStore.setStatus("connected");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown Bluetooth error";
      appStore.setStatus("error", msg);
    }
  };

  const toggleDemo = () => appStore.setDemoMode(!demoMode);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Hero strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-elevated via-surface to-background p-6 sm:p-8"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
              <Car className="h-3 w-3" /> GM Specialized · Chevy · GMC · Cadillac · Buick
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Your GM, <span className="text-gradient">decoded in real time.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              EliteScan turns your ELM327 Bluetooth adapter into a professional diagnostic
              terminal — with deep manufacturer-specific code intelligence built for GM trucks,
              SUVs, and sedans.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              onClick={handleConnect}
              disabled={!isWebBluetoothSupported()}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground glow-primary transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              <Bluetooth className="h-4 w-4" />
              Connect Device
            </button>
            <button
              onClick={toggleDemo}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                demoMode
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="h-4 w-4" />
              {demoMode ? "Demo: ON" : "Demo Mode"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMessage}
          </div>
        )}
        {!isWebBluetoothSupported() && (
          <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
            Web Bluetooth isn't available in this browser. Use Chrome on Android, macOS, or
            desktop, or stay in Demo Mode to explore.
          </div>
        )}
      </motion.section>

      {/* Gauges */}
      <section className="mb-8">
        <SectionHeading icon={<GaugeIcon className="h-4 w-4" />} title="Live Telemetry" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GaugeCard>
            <Gauge
              label="Engine RPM"
              value={live.rpm}
              unit="× 1000"
              min={0}
              max={8000}
              warnAt={5500}
              dangerAt={6800}
              icon={<Cpu className="h-3 w-3" />}
              precision={0}
            />
          </GaugeCard>
          <GaugeCard>
            <Gauge
              label="Vehicle Speed"
              value={live.speed}
              unit="km/h"
              min={0}
              max={220}
              warnAt={140}
              dangerAt={180}
              icon={<TrendingUp className="h-3 w-3" />}
            />
          </GaugeCard>
          <GaugeCard>
            <Gauge
              label="Coolant Temp"
              value={live.coolantTemp}
              unit="°C"
              min={0}
              max={130}
              warnAt={105}
              dangerAt={115}
              icon={<Thermometer className="h-3 w-3" />}
              precision={1}
            />
          </GaugeCard>
          <GaugeCard>
            <Gauge
              label="Fuel Trim ST"
              value={live.fuelTrim}
              unit="%"
              min={-25}
              max={25}
              warnAt={10}
              dangerAt={15}
              icon={<Droplets className="h-3 w-3" />}
              precision={1}
            />
          </GaugeCard>
        </div>
      </section>

      {/* Secondary readouts */}
      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Battery" value={`${live.voltage.toFixed(2)} V`} icon={<Zap />} />
        <Stat label="Engine Load" value={`${live.load} %`} icon={<Activity />} />
        <Stat
          label="Status"
          value={demoMode ? "Demo" : status === "connected" ? "Live" : "Offline"}
          icon={<Bluetooth />}
        />
        <Stat label="Protocol" value="ISO 15765-4" icon={<Cpu />} />
      </section>

      {/* CTA to scan */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="scanline relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 sm:p-8"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              Ready to read fault codes?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Scan your GM vehicle's ECM for active and pending DTCs with intelligent fix
              suggestions.
            </p>
          </div>
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground glow-primary transition-transform hover:scale-[1.02]"
          >
            <ScanLine className="h-4 w-4" />
            Run Diagnostic
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-foreground">
        {title}
      </h2>
      <div className="ml-2 h-px flex-1 bg-gradient-to-r from-border to-transparent" />
    </div>
  );
}

function GaugeCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4 transition-shadow hover:shadow-[0_0_30px_-10px_var(--primary)]">
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="text-primary [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="mt-2 font-mono text-lg font-bold text-foreground tabular-nums">{value}</div>
    </div>
  );
}
