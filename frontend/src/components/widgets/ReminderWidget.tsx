import { GlassCard } from "../ui/glass-card";

export function ReminderWidget() {
    return (
        <GlassCard className="glass-widget w-72">
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white/70">Reminders</h3>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                3
                </span>
            </div>

            <div className="space-y-3">
                <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-white/45">Today</p>

                <div className="rounded-xl bg-white/5 px-3 py-2">
                    <p className="text-sm font-medium text-white">Team meeting</p>
                    <p className="text-xs text-white/55">15:00</p>
                </div>

                <div className="rounded-xl bg-white/5 px-3 py-2">
                    <p className="text-sm font-medium text-white">Buy groceries</p>
                    <p className="text-xs text-white/55">18:30</p>
                </div>
                </div>

                <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-white/45">Tomorrow</p>

                <div className="rounded-xl bg-white/5 px-3 py-2">
                    <p className="text-sm font-medium text-white">Gym</p>
                    <p className="text-xs text-white/55">09:00</p>
                </div>
                </div>
            </div>
        </div>
        </GlassCard>
    );
}

export default ReminderWidget;