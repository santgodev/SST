import { ShieldCheck } from 'lucide-react'
import { AuthForm } from '@/components/auth/AuthForm'

export default async function LoginPage(props: {
    searchParams: Promise<{ message: string }>
}) {
    const searchParams = await props.searchParams

    return (
        <div className="flex min-h-screen w-full font-sans bg-background selection:bg-primary/20">

            {/* Columna Izquierda - Branding (Desktop) */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-950 items-center justify-center p-12 overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-indigo-950/30"></div>

                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="space-y-6">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 ring-1 ring-white/20">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight text-white">SST Next Gen</h2>
                        <div className="h-1 w-20 bg-indigo-500 rounded-full"></div>
                        <p className="text-xl text-zinc-400 font-light leading-relaxed">
                            La seguridad laboral no es un juego. Adminístrala con herramientas profesionales.
                        </p>
                    </div>

                    <div className="flex gap-8 pt-8">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">U{i}</div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-semibold text-white">+2k Empresas</span>
                            <span className="text-xs text-zinc-500">Confían en nosotros</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Columna Derecha - Auth (y Mobile Branding) */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-background">

                {/* Mobile Header Branding (Visible only on small screens) */}
                <div className="lg:hidden absolute top-8 left-0 w-full px-8 pb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground">
                        <ShieldCheck className="h-6 w-6 text-indigo-600" />
                        <span className="font-bold tracking-tight">SST Next</span>
                    </div>
                </div>

                <div className="w-full max-w-sm">
                    <div className="mb-8 lg:hidden">
                        <h2 className="text-2xl font-bold text-foreground">Bienvenido</h2>
                        <p className="text-muted-foreground">Gestiona tu seguridad en cualquier lugar.</p>
                    </div>

                    <AuthForm message={searchParams?.message} />
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-6 text-center text-xs text-muted-foreground hidden lg:block">
                    SST Platform v2.5.0 &bull; Conexión Segura
                </div>
            </div>
        </div>
    )
}
