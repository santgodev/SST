import { ChecklistManager } from '@/components/checklist/ChecklistManager';

export default function DashboardHome() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Panel de Control</h2>
            </div>

            <ChecklistManager />
        </div>
    );
}
