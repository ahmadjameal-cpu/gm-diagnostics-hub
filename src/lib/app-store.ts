import { useSyncExternalStore } from "react";
import type { ConnectionStatus } from "./obd2";
import type { DtcInfo } from "./gm-dtc";

export interface ScanRecord {
  id: string;
  scannedAt: number;
  vehicle: string;
  codes: DtcInfo[];
}

interface AppState {
  status: ConnectionStatus;
  demoMode: boolean;
  errorMessage: string | null;
  history: ScanRecord[];
  activeCodes: DtcInfo[];
}

let state: AppState = {
  status: "idle",
  demoMode: true,
  errorMessage: null,
  history: [],
  activeCodes: [],
};

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;
const emit = () => listeners.forEach((l) => l());

function set(patch: Partial<AppState>) {
  state = { ...state, ...patch };
  emit();
}

export const appStore = {
  setStatus: (status: ConnectionStatus, errorMessage: string | null = null) =>
    set({ status, errorMessage }),
  setDemoMode: (demoMode: boolean) => {
    set({
      demoMode,
      status: demoMode ? "idle" : "idle",
      errorMessage: null,
    });
  },
  recordScan: (codes: DtcInfo[]) => {
    const record: ScanRecord = {
      id: crypto.randomUUID(),
      scannedAt: Date.now(),
      vehicle: "GM Vehicle",
      codes,
    };
    set({ activeCodes: codes, history: [record, ...state.history].slice(0, 50) });
  },
  clearActive: () => set({ activeCodes: [] }),
  clearHistory: () => set({ history: [] }),
};

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
