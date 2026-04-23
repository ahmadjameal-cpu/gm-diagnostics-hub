/**
 * OBD2 / ELM327 Web Bluetooth helpers and types.
 *
 * Note: Web Bluetooth support varies; ELM327 BLE adapters expose Nordic UART
 * style services. This module abstracts connection state and emits live PIDs.
 */

export type ConnectionStatus =
  | "idle"
  | "searching"
  | "connecting"
  | "connected"
  | "error";

export interface LiveData {
  rpm: number;
  speed: number; // km/h
  coolantTemp: number; // °C
  fuelTrim: number; // % short-term bank 1
  voltage: number; // V
  load: number; // %
}

export const EMPTY_LIVE: LiveData = {
  rpm: 0,
  speed: 0,
  coolantTemp: 0,
  fuelTrim: 0,
  voltage: 0,
  load: 0,
};

/** Detect Web Bluetooth availability. */
export function isWebBluetoothSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  return "bluetooth" in navigator;
}

/**
 * Stub for real ELM327 connection. In a full implementation this would:
 *  - request a BLE device with Nordic UART service
 *  - send AT init commands ("ATZ", "ATE0", "ATSP0")
 *  - poll Mode 01 PIDs (010C, 010D, 0105, 0106) and Mode 03 for DTCs
 *
 * It throws by design so the UI can surface a helpful error and fall back
 * to mock mode for testing.
 */
export async function connectElm327(): Promise<never> {
  if (!isWebBluetoothSupported()) {
    throw new Error("Web Bluetooth isn't available in this browser.");
  }
  // Trigger the chooser so the user sees real device discovery UX.
  await (navigator as Navigator & { bluetooth: { requestDevice: (o: unknown) => Promise<unknown> } })
    .bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ["0000fff0-0000-1000-8000-00805f9b34fb"],
    });
  throw new Error(
    "ELM327 protocol handshake not implemented in this build — toggle Demo Mode to explore the dashboard.",
  );
}
