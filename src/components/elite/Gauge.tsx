import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface GaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  /** Threshold above which the gauge glows in warning color */
  warnAt?: number;
  dangerAt?: number;
  icon?: React.ReactNode;
  precision?: number;
}

export function Gauge({
  label,
  value,
  unit,
  min,
  max,
  warnAt,
  dangerAt,
  icon,
  precision = 0,
}: GaugeProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const pct = (clamped - min) / (max - min);

  // Arc is 240° starting at -210°
  const totalArc = 240;
  const startAngle = -210;
  const endAngle = startAngle + totalArc * pct;

  const radius = 78;
  const cx = 100;
  const cy = 100;

  const polar = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const arcPath = (a1: number, a2: number) => {
    const start = polar(a1);
    const end = polar(a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  };

  const spring = useSpring(value, { stiffness: 90, damping: 18 });
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const display = useTransform(spring, (v) => v.toFixed(precision));

  const danger = dangerAt !== undefined && value >= dangerAt;
  const warn = !danger && warnAt !== undefined && value >= warnAt;
  const stateColor = danger ? "var(--destructive)" : warn ? "var(--warning)" : "var(--primary)";

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 200 170" className="w-full max-w-[220px]">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-glow)" />
          </linearGradient>
          <filter id={`glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={arcPath(startAngle, startAngle + totalArc)}
          stroke="var(--border)"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
        {/* Active arc */}
        <motion.path
          d={arcPath(startAngle, endAngle)}
          stroke={danger || warn ? stateColor : `url(#grad-${label})`}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          filter={`url(#glow-${label})`}
          initial={false}
          animate={{ d: arcPath(startAngle, endAngle) }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />

        {/* Tick marks */}
        {Array.from({ length: 9 }).map((_, i) => {
          const a = startAngle + (totalArc / 8) * i;
          const inner = polar(a);
          const outerR = radius + 8;
          const outer = {
            x: cx + outerR * Math.cos((a * Math.PI) / 180),
            y: cy + outerR * Math.sin((a * Math.PI) / 180),
          };
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              opacity={0.4}
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
          {icon}
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">{label}</span>
        </div>
        <motion.div
          className="font-mono text-3xl font-bold tabular-nums text-foreground glow-text"
          style={{ color: danger ? stateColor : warn ? stateColor : undefined }}
        >
          <motion.span>{display}</motion.span>
        </motion.div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {unit}
        </div>
      </div>
    </div>
  );
}
