export interface DtcInfo {
  code: string;
  title: string;
  explanation: string;
  fix: string;
  severity: "low" | "medium" | "high";
  system: string;
}

export const GM_DTC_DATABASE: Record<string, DtcInfo> = {
  "P0300": {
    code: "P0300",
    title: "اختلال احتراق عشوائي (Misfire)",
    explanation: "يوجد فشل في عملية الاحتراق داخل إحدى اسطوانات المحرك بشكل غير منتظم.",
    fix: "افحص شمعات الاحتراق (البواجي) وأسلاك الكويلات، وتأكد من ضغط الوقود.",
    severity: "high",
    system: "Engine"
  },
  "P1101": {
    code: "P1101",
    title: "أداء نظام تدفق الهواء (MAF)",
    explanation: "حساس الهواء يقرأ قيم غير متطابقة مع وضع بوابة الهواء (Throttle).",
    fix: "قم بتنظيف بوابة الهواء (Throttle Body) وحساس MAF بمنظف مخصص.",
    severity: "medium",
    system: "Intake"
  },
  "P0700": {
    code: "P0700",
    title: "عطل في وحدة تحكم ناقل الحركة (TCM)",
    explanation: "هناك طلب من وحدة القير لتشغيل لمبة المكينة بسبب خلل في التعشيق.",
    fix: "يتطلب فحص كمبيوتر متخصص للقير (TCM) للتأكد من الحساسات الداخلية.",
    severity: "high",
    system: "Transmission"
  }
};
