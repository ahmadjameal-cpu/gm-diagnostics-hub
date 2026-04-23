import { motion } from "framer-motion";
import type { ConnectionStatus } from "@/lib/obd2";
import { Bluetooth, BluetoothConnected, BluetoothSearching, CircleAlert } from "lucide-react";

interface PillCfg {
  label: string;
  dot: string;
  text: string;
  icon: React.ElementType;
  pulse: boolean;
}

const STATUS_MAP: Record<ConnectionStatus, PillCfg> = {
  idle: {
    label: "Disconnected",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    icon: Bluetooth,
    pulse: false,
  },
  searching: {
    label: "Searching",
    dot: "bg-primary",
    text: "text-primary",
    icon: BluetoothSearching,
    pulse: true,
  },
  connecting: {
    label: "Connecting",
    dot: "bg-warning",
    text: "text-warning",
    icon: BluetoothSearching,
    pulse: true,
  },
  connected: {
    label: "Connected",
    dot: "bg-success",
    text: "text-success",
    icon: BluetoothConnected,
    pulse: false,
  },
  error: {
    label: "Error",
    dot: "bg-destructive",
    text: "text-destructive",
    icon: CircleAlert,
    pulse: false,
  },
};

const DEMO_CFG: PillCfg = {
  label: "Demo Mode",
  dot: "bg-primary",
  text: "text-primary",
  icon: BluetoothConnected,
  pulse: true,
};

export function StatusPill({
  status,
  demo = false,
}: {
  status: ConnectionStatus;
  demo?: boolean;
}) {
  const cfg = demo ? DEMO_CFG : STATUS_MAP[status];
  const Icon = cfg.icon;
  return (
    <motion.div
      layout
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 backdrop-blur"
    >
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${cfg.dot} ${cfg.pulse ? "pulse-glow" : ""}`}
      />
      <Icon className={`h-3.5 w-3.5 ${cfg.text}`} />
      <span className="font-mono text-xs uppercase tracking-wider text-foreground">
        {cfg.label}
      </span>
    </motion.div>
  );
}
