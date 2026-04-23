import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

// تم تعديل الألوان لتكون متوافقة مع الثيم البنفسجي والنيون
export function Gauge({ label, value, unit, min, max, warnAt, dangerAt, icon }: any) {
  const springValue = useSpring(value, { stiffness: 40, damping: 12 });
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (v) => v.toFixed(0));
  const rotateAngle = useTransform(springValue, [min, max], [-110, 110]);

  return (
    <div className="card-3d p-8 flex flex-col items-center justify-center min-w-[240px]">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Outer Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
          <motion.circle 
            cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={440}
            style={{ 
              pathLength: useTransform(springValue, [min, max], [0, 1]),
              color: value >= (dangerAt || max) ? "#ef4444" : "#8b5cf6" 
            }}
            strokeLinecap="round"
          />
        </svg>

        {/* Value Display */}
        <div className="text-center z-10">
          <motion.span className="text-5xl font-black text-white text-glow-violet leading-none">
            {displayValue}
          </motion.span>
          <p className="text-[10px] font-bold text-primary tracking-widest mt-2">{unit}</p>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2">
        <span className="text-white/40">{icon}</span>
        <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );
}
