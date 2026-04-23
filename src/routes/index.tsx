import { createFileRoute } from '@tanstack/react-router';
import { Gauge } from '@/components/elite/Gauge';
import { Car, Zap, Thermometer, Activity } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  // هنا يتم استدعاء البيانات من الـ Store الخاص بك
  return (
    <div className="p-6 lg:p-12 space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white italic">DASHBOARD <span className="text-primary">LIVE</span></h2>
        <p className="text-muted-foreground text-sm">بيانات المحرك المباشرة عبر بروتوكول OBD2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Gauge label="Engine RPM" value={850} min={0} max={8000} unit="RPM" icon={<Activity size={16}/>} />
        <Gauge label="Coolant" value={92} min={0} max={120} unit="°C" icon={<Thermometer size={16}/>} />
        <Gauge label="Engine Load" value={35} min={0} max={100} unit="%" icon={<Zap size={16}/>} />
      </div>
    </div>
  );
}
