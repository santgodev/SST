import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NewAreaDialog } from '@/components/zones/NewAreaDialog'
import { Map, ArrowRight, MoreVertical } from 'lucide-react'

export default async function ZonesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Get My Company ID
    const { data: membership } = await supabase
        .from('miembros_empresa')
        .select('empresa_id, rol')
        .eq('usuario_id', user.id)
        .single()

    if (!membership) return <div>No tienes empresa.</div>

    // Fetch Areas
    const { data: areas } = await supabase
        .from('areas')
        .select('*')
        .eq('empresa_id', membership.empresa_id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Plantas y Espacios</h1>
                    <p className="text-muted-foreground">Registra los planos arquitectónicos de tus pisos o sedes.</p>
                </div>
                {/* Only Admins/Inspectors can likely create zones, assuming Logic */}
                <NewAreaDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {areas?.map((area) => (
                    <Link
                        key={area.id}
                        href={`/zones/${area.id}`}
                        className="group relative bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                        {/* Image Preview */}
                        <div className="aspect-video w-full bg-zinc-950 relative overflow-hidden">
                            <img
                                src={area.imagen_url}
                                alt={area.nombre}
                                className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                                <h3 className="text-white font-semibold text-lg">{area.nombre}</h3>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {area.descripcion || 'Sin descripción'}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs text-zinc-500 font-mono">
                                    ID: {area.id.slice(0, 8)}
                                </span>
                                <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                    Editar Zonas <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {(!areas || areas.length === 0) && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl bg-secondary/20">
                        <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                            <Map className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No hay planos registrados</h3>
                        <p className="text-muted-foreground max-w-sm mt-1">
                            Sube tu primer plano arquitectónico para comenzar a definir zonas de riesgo.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
