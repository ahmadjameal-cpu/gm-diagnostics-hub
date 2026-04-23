import { useEffect, useState } from "react";
import type { LiveData } from "@/lib/obd2";

/**
 * Generates plausible live OBD-II telemetry for demo mode.
 * Simulates a vehicle accelerating, cruising, and idling.
 */
export function useMockTelemetry(active: boolean): LiveData {
  const [data, setData] = useState<LiveData>({
    rpm: 820,
    speed: 0,
    coolantTemp: 78,
    fuelTrim: 1.2,
    voltage: 14.1,
    load: 18,
  });

  useEffect(() => {
    if (!active) return;
    let t = 0;
    const id = setInterval(() => {
      t += 1;
      const cyclePhase = (t % 60) / 60; // 0..1
      const wave = Math.sin(cyclePhase * Math.PI * 2);

      const targetSpeed = Math.max(0, 55 + wave * 45 + (Math.random() - 0.5) * 6);
      const targetRpm = 750 + targetSpeed * 28 + (Math.random() - 0.5) * 120;
      const coolant = 88 + Math.sin(t / 20) * 4 + (Math.random() - 0.5);
      const trim = wave * 4 + (Math.random() - 0.5) * 2;
      const load = 15 + (targetSpeed / 100) * 70 + (Math.random() - 0.5) * 5;
      const voltage = 14 + (Math.random() - 0.5) * 0.4;

      setData({
        rpm: Math.round(targetRpm),
        speed: Math.round(targetSpeed),
        coolantTemp: Math.round(coolant * 10) / 10,
        fuelTrim: Math.round(trim * 10) / 10,
        voltage: Math.round(voltage * 100) / 100,
        load: Math.round(load),
      });
    }, 400);
    return () => clearInterval(id);
  }, [active]);

  return data;
}
