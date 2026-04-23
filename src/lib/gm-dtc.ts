export type DtcSeverity = "low" | "medium" | "high";

export interface DtcInfo {
  code: string;
  title: string;
  explanation: string;
  fix: string;
  severity: DtcSeverity;
  system: "Engine" | "Transmission" | "Emissions" | "Electrical" | "Body" | "Chassis";
}

/**
 * GM-focused DTC dictionary.
 * Includes generic OBD-II P-codes commonly seen on GM vehicles
 * plus GM-specific P1xxx manufacturer codes.
 */
export const GM_DTC: Record<string, DtcInfo> = {
  // --- Generic Powertrain (common on GM) ---
  P0010: {
    code: "P0010",
    title: "Camshaft Position Actuator Circuit (Bank 1)",
    explanation:
      "The intake camshaft actuator solenoid on bank 1 isn't responding correctly. Common on GM 3.6L V6 and Ecotec engines.",
    fix: "Replace the camshaft position actuator solenoid. Check for low oil level or sludge — GM VVT systems are oil-pressure sensitive.",
    severity: "medium",
    system: "Engine",
  },
  P0014: {
    code: "P0014",
    title: "Exhaust Camshaft Position — Timing Over-Advanced (Bank 1)",
    explanation:
      "The exhaust cam timing is more advanced than the ECM commands. Frequent on GM 3.6L LFX/LLT engines.",
    fix: "Inspect VVT solenoid, oil control valve screen, and timing chain stretch. Use only GM-spec dexos oil.",
    severity: "high",
    system: "Engine",
  },
  P0101: {
    code: "P0101",
    title: "MAF Sensor Performance",
    explanation:
      "Mass Airflow sensor readings are out of expected range — engine isn't getting the airflow it expects.",
    fix: "Clean the MAF sensor with MAF-safe spray. Check the air filter and intake tube for cracks.",
    severity: "medium",
    system: "Engine",
  },
  P0128: {
    code: "P0128",
    title: "Coolant Temperature Below Thermostat Regulating Temperature",
    explanation:
      "The engine isn't reaching its normal operating temperature — usually a stuck-open thermostat.",
    fix: "Replace the engine thermostat. Verify the coolant temperature sensor reads correctly when warm.",
    severity: "low",
    system: "Engine",
  },
  P0171: {
    code: "P0171",
    title: "System Too Lean (Bank 1)",
    explanation:
      "The engine is running with too much air or not enough fuel. Very common on GM 5.3L Vortec and 2.4L Ecotec.",
    fix: "Check for vacuum leaks (intake gaskets are common on GM), test fuel pressure, inspect MAF sensor.",
    severity: "medium",
    system: "Engine",
  },
  P0300: {
    code: "P0300",
    title: "Random / Multiple Cylinder Misfire Detected",
    explanation:
      "The ECM detects misfires across multiple cylinders. The engine may shake, lose power, or run rough.",
    fix: "Replace spark plugs (AC Delco Iridium for GM), inspect ignition coils, check fuel injectors and compression.",
    severity: "high",
    system: "Engine",
  },
  P0301: {
    code: "P0301",
    title: "Cylinder 1 Misfire Detected",
    explanation: "Cylinder 1 is misfiring intermittently or continuously.",
    fix: "Swap the coil pack and spark plug from cylinder 1 with another cylinder to isolate the fault.",
    severity: "high",
    system: "Engine",
  },
  P0420: {
    code: "P0420",
    title: "Catalyst System Efficiency Below Threshold (Bank 1)",
    explanation:
      "The catalytic converter isn't cleaning the exhaust as well as it should. Extremely common as GM trucks age.",
    fix: "Verify O2 sensor operation first. If the cat is original and high-mileage, replacement is usually required.",
    severity: "medium",
    system: "Emissions",
  },
  P0442: {
    code: "P0442",
    title: "EVAP System Small Leak Detected",
    explanation: "A small leak in the evaporative emissions system — most often a loose or failing fuel cap.",
    fix: "Tighten or replace the fuel cap. If it returns, smoke-test the EVAP system for hose or canister leaks.",
    severity: "low",
    system: "Emissions",
  },
  P0455: {
    code: "P0455",
    title: "EVAP System Large Leak Detected",
    explanation: "A large leak in the EVAP system — usually a missing/damaged fuel cap or disconnected hose.",
    fix: "Replace the fuel cap. Inspect EVAP hoses and the purge valve, especially on Silverado/Sierra trucks.",
    severity: "low",
    system: "Emissions",
  },
  P0496: {
    code: "P0496",
    title: "EVAP System Flow During Non-Purge",
    explanation:
      "The EVAP purge valve is stuck open. Notorious problem on GM trucks and Equinox/Terrain.",
    fix: "Replace the EVAP purge solenoid valve — typically mounted on top of the engine near the intake.",
    severity: "low",
    system: "Emissions",
  },
  P0507: {
    code: "P0507",
    title: "Idle Air Control System RPM Higher Than Expected",
    explanation: "Engine idles too high — usually a vacuum leak or dirty throttle body on drive-by-wire GM engines.",
    fix: "Clean the throttle body and perform an idle relearn. Check for intake manifold leaks.",
    severity: "medium",
    system: "Engine",
  },

  // --- GM Manufacturer-Specific (P1xxx) ---
  P1101: {
    code: "P1101",
    title: "Intake Air Flow System Performance (GM)",
    explanation:
      "GM-specific — the MAF sensor or intake system isn't performing within range. Very common on 2.4L Ecotec (Equinox, Terrain, Malibu).",
    fix: "Inspect intake manifold for cracks, clean MAF, check PCV system. The intake manifold itself often needs replacement.",
    severity: "medium",
    system: "Engine",
  },
  P1133: {
    code: "P1133",
    title: "HO2S Insufficient Switching (Bank 1 Sensor 1)",
    explanation: "GM-specific — the upstream oxygen sensor isn't switching between rich and lean fast enough.",
    fix: "Replace the upstream O2 sensor on bank 1. Use an AC Delco sensor for best compatibility.",
    severity: "medium",
    system: "Emissions",
  },
  P1345: {
    code: "P1345",
    title: "Crankshaft Position — Camshaft Position Correlation",
    explanation:
      "GM-specific — the relationship between crank and cam sensors is out of spec. Common on Vortec V8s with timing chain wear.",
    fix: "Inspect timing chain for stretch, verify crank/cam sensors. May indicate jumped timing.",
    severity: "high",
    system: "Engine",
  },
  P1516: {
    code: "P1516",
    title: "Throttle Actuator Control Module Throttle Actuator Position Performance",
    explanation:
      "GM-specific — the throttle body isn't moving as commanded. Will trigger Reduced Engine Power on GM trucks and SUVs.",
    fix: "Replace the electronic throttle body. Clear codes and perform throttle relearn procedure.",
    severity: "high",
    system: "Engine",
  },
  P1682: {
    code: "P1682",
    title: "Ignition 1 Switch Circuit 2",
    explanation:
      "GM-specific — the ignition switch's secondary circuit voltage is incorrect. Will throw Reduced Power message.",
    fix: "Inspect ignition switch wiring, fusible links, and ignition relay. Common after battery replacement.",
    severity: "high",
    system: "Electrical",
  },
  P1860: {
    code: "P1860",
    title: "TCC PWM Solenoid Electrical Fault",
    explanation:
      "GM-specific transmission — Torque Converter Clutch solenoid issue. Causes shudder or stall when stopping.",
    fix: "Replace TCC PWM solenoid inside the transmission. Consider full fluid + filter service.",
    severity: "high",
    system: "Transmission",
  },
  U0100: {
    code: "U0100",
    title: "Lost Communication With ECM/PCM",
    explanation: "Modules on the GMLAN bus can't talk to the engine computer.",
    fix: "Check ECM power/grounds and the GMLAN data circuit. Inspect for water intrusion in connectors.",
    severity: "high",
    system: "Electrical",
  },
};

export const ALL_DTC_CODES = Object.keys(GM_DTC);

export function lookupDtc(code: string): DtcInfo {
  const upper = code.toUpperCase();
  return (
    GM_DTC[upper] ?? {
      code: upper,
      title: "Unknown Diagnostic Trouble Code",
      explanation:
        "This code isn't in the GM-specific database. Check a manufacturer service manual for definition.",
      fix: "Consult a GM dealer or qualified technician for a manufacturer-specific lookup.",
      severity: "medium",
      system: "Engine",
    }
  );
}
