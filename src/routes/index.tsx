import React, { useState } from 'react';
import { 
  Bluetooth, 
  Car, 
  Activity, 
  AlertTriangle, 
  Gauge, 
  ShieldAlert,
  ChevronRight,
  Wrench,
  Wifi
} from 'lucide-react';

// قاعدة بيانات أعطال GM المتخصصة مع الشرح
const GM_CODES_DB = {
  "P0300": {
    name: "Random Misfire Detected",
    arName: "اختلال احتراق عشوائي",
    desc: "المحرك يواجه صعوبة في إتمام عملية الاحتراق في عدة اسطوانات بشكل غير منتظم.",
    fix: "افحص شمعات الاحتراق (البواجي) وأسلاك الكويلات، وتأكد من ضغط الوقود."
  },
  "P1101": {
    name: "Intake Air Flow System Performance",
    arName: "أداء تدفق هواء السحب (خاص بـ GM)",
    desc: "حساس الهواء يقرأ قيم خارج النطاق المتوقع، غالباً بسبب اتساخ البوابة.",
    fix: "قم بتنظيف بوابة الهواء (Throttle Body) وحساس الـ MAF."
  },
  "P0420": {
    name: "Catalyst System Efficiency",
    arName: "كفاءة دبة التلوث منخفضة",
    desc: "علبة البيئة لا تقوم بوظيفتها في تنقية العادم بشكل كامل.",
    fix: "تأكد من عدم وجود تسريب في العادم أو استبدل دبة التلوث إذا كانت منسدة."
  },
  "P0700": {
    name: "Transmission Control System",
    arName: "عطل في نظام القير",
    desc: "وحدة التحكم في المحرك تلقت إشارة بوجود عطل في ناقل الحركة.",
    fix: "يجب فحص كمبيوتر القير (TCM) لتحديد الحساس أو الصمام المعطل."
  }
};

const Index = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setConnected(!connected);
      setLoading(false);
      if (!connected) setCodes(["P0300", "P1101"]);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center">
      
      {/* Top Navigation / Header */}
      <nav className="w-full max-w-6xl flex justify-between items-center mb-16 card-3d p-6">
        <div className="flex items-center gap-4 animate-float">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30">
            <Car className="text-purple-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-widest text-white text-glow">GM SCANNER</h1>
            <p className="text-[10px] text-purple-400 font-bold tracking-[0.2em] uppercase">V2.0 Bluetooth Elite</p>
          </div>
        </div>

        <button 
          onClick={handleConnect}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${
            connected 
            ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
            : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Bluetooth size={18} />
              {connected ? "Device Connected" : "Connect OBD2"}
            </>
          )}
        </button>
      </nav>

      {/* Main Stats Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Engine RPM", value: connected ? "840" : "0", unit: "RPM", icon: <Gauge className="text-purple-400" /> },
          { label: "Coolant Temp", value: connected ? "94" : "0", unit: "°C", icon: <Activity className="text-pink-400" /> },
          { label: "Voltage", value: connected ? "14.1" : "0", unit: "V", icon: <Wifi className="text-blue-400" /> },
        ].map((item, i) => (
          <div key={i} className="card-3d p-8 flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-white/5 rounded-full">{item.icon}</div>
            <span className="text-xs font-bold text-purple-300/60 uppercase tracking-widest mb-1">{item.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">{item.value}</span>
              <span className="text-xs text-purple-400">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostics Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-3d p-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="text-purple-400" /> Control Center
            </h3>
            <p className="text-sm text-purple-200/50 mb-6">قم ببدء فحص شامل لجميع وحدات GM الإلكترونية والحصول على تقرير مفصل.</p>
            <button 
              disabled={!connected}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-black tracking-wider hover:opacity-90 transition-all disabled:opacity-20 shadow-xl"
            >
              START FULL SCAN
            </button>
          </div>

          <div className="card-3d p-6 bg-purple-900/20!">
             <div className="flex items-center gap-3 text-xs font-mono text-purple-400/80">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Status: Ready for GM Protocols
             </div>
          </div>
        </div>

        {/* Right Side: Fault Codes Display */}
        <div className="lg:col-span-3 card-3d p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Detected Faults</h3>
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-300">
              {codes.length} Codes Found
            </span>
          </div>

          <div className="space-y-6">
            {codes.length > 0 ? (
              codes.map((code) => {
                const data = GM_CODES_DB[code as keyof typeof GM_CODES_DB];
                return (
                  <div key={code} className="group bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-purple-500/5 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center justify-center bg-purple-600/20 border border-purple-600/30 w-full md:w-24 h-20 rounded-xl">
                        <span className="text-xl font-black text-purple-400">{code}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg text-white">{data.arName}</h4>
                          <ChevronRight className="text-purple-900 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <p className="text-sm text-purple-200/60 mb-4">{data.desc}</p>
                        <div className="bg-purple-500/10 p-4 rounded-xl flex gap-3 border-l-4 border-purple-500">
                          <Wrench className="text-purple-400 w-5 h-5 flex-shrink-0" />
                          <p className="text-xs leading-relaxed text-purple-100/80">
                            <span className="font-bold text-purple-400 block mb-1">الحل المقترح:</span>
                            {data.fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-purple-500/20 rounded-3xl">
                <AlertTriangle size={48} className="mb-4" />
                <p>No active faults. Vehicle system is clear.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-16 text-[10px] uppercase tracking-[0.5em] text-purple-500/40 font-bold">
        AJ Technical Industries • 2026
      </footer>
    </div>
  );
};

export default Index;
