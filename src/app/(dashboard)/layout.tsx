import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Fetch Profile (Name)
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

    // 2. Fetch Role in Company (assuming single company for MVP)
    const { data: membership } = await supabase
        .from('miembros_empresa')
        .select('rol')
        .eq('usuario_id', user.id)
        .single()

    return (
        <div className="flex min-h-screen w-full bg-secondary/30">
            <Sidebar
                userEmail={user.email}
                userName={profile?.full_name ?? null}
                userRole={membership?.rol ?? null}
            />
            <div className="flex flex-col flex-1 min-w-0">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
