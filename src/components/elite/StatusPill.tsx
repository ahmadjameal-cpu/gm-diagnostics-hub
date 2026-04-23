import { motion } from "framer-motion";
import type { ConnectionStatus } from "@/lib/obd2";
import { Bluetooth, BluetoothConnected, BluetoothSearching, CircleAlert } from "lucide-react";

const STATUS_MAP: Record<
  ConnectionStatus,
  { label: string; color: string; icon: React.ElementType; pulse: boolean }
> = {
  idle: { label: "Disconnected", color: "muted-foreground", icon: Bluetooth, pulse: false },
  searching: { label: "Searching", color: "primary", icon: BluetoothSearching, pulse: true },
  connecting: { label: "Connecting", color: "warning", icon: BluetoothSearching, pulse: true },
  connected: { label: "Connected", color: "success", icon: BluetoothConnected, pulse: false },
  error: { label: "Error", color: "destructive", icon: CircleAlert, pulse: false },
};

export function StatusPill({
  status,
  demo = false,
}: {
  status: ConnectionStatus;
  demo?: boolean;
}) {
  const cfg = demo
    ? { label: "Demo Mode", color: "primary", icon: BluetoothConnected, pulse: true }
    : STATUS_MAP[status];
  const Icon = cfg.icon;
  return (
    <motion.div
      layout
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 backdrop-blur"
    >
      <span
        className={`relative inline-flex h-2 w-2 rounded-full bg-${cfg.color} ${cfg.pulse ? "pulse-glow" : ""}`}
      />
      <Icon className={`h-3.5 w-3.5 text-${cfg.color}`} />
      <span className="font-mono text-xs uppercase tracking-wider text-foreground">
        {cfg.label}
      </span>
    </motion.div>
  );
}
