import { Link, useLocation } from "@tanstack/react-router";
import { EliteLogo } from "./Logo";
import { StatusPill } from "./StatusPill";
import { Gauge as GaugeIcon, ScanLine, History } from "lucide-react";
import type { ConnectionStatus } from "@/lib/obd2";

const NAV = [
  { to: "/", label: "Dashboard", icon: GaugeIcon },
  { to: "/scan", label: "Trouble Codes", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
] as const;

export function Header({
  status,
  demo,
}: {
  status: ConnectionStatus;
  demo: boolean;
}) {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex-shrink-0">
          <EliteLogo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-3 h-0.5 rounded-full bg-gradient-to-r from-primary to-primary-glow" />
                )}
              </Link>
            );
          })}
        </nav>

        <StatusPill status={status} demo={demo} />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border/60 bg-background/90 backdrop-blur-xl py-2 md:hidden">
        {NAV.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
