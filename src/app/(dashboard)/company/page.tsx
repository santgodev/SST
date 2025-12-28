import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Building2, MapPin, Phone, Mail, FileText } from 'lucide-react'

export default async function CompanyPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    // Get My Company
    const { data: membership } = await supabase
        .from('miembros_empresa')
        .select('empresa_id, rol')
        .eq('usuario_id', user.id)
        .single()

    if (!membership) return <div className="p-8">No tienes una empresa asignada.</div>

    const { data: company } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', membership.empresa_id)
        .single()

    if (!company) return <div>Empresa no encontrada.</div>

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Mi Empresa</h2>
                <p className="text-muted-foreground">Información general de la organización.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Main Info Card */}
                <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {company.nombre}
                    </h3>

                    <div className="grid gap-4 text-sm">
                        <div className="flex items-start gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <span className="font-medium block">NIT / Identificación</span>
                                <span className="text-muted-foreground">{company.nit}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <span className="font-medium block">Dirección</span>
                                <span className="text-muted-foreground">{company.direccion || 'Sin registrar'}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <span className="font-medium block">Teléfono</span>
                                <span className="text-muted-foreground">{company.telefono || 'Sin registrar'}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <span className="font-medium block">Email Corporativo</span>
                                <span className="text-muted-foreground">{company.email || 'Sin registrar'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats or Config Card (Placeholder) */}
                <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium">Configuración Avanzada</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Próximamente podrás editar logos y configuraciones SST aquí.
                        </p>
                    </div>
                    {membership.rol === 'admin' && (
                        <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Editar Información
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
