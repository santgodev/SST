import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { AreaMapEditor } from '@/components/zones/AreaMapEditor'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: {
        areaId: string
    }
}

export default async function AreaDetailsPage({ params }: PageProps) {
    // Next.js 15 requires awaiting params
    const { areaId } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch Area
    const { data: area } = await supabase
        .from('areas')
        .select('*')
        .eq('id', areaId)
        .single()

    if (!area) return notFound()

    // Fetch Zones
    const { data: zones } = await supabase
        .from('zonas')
        .select('*')
        .eq('area_id', areaId)

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/zones" className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                            {area.nombre}
                        </h1>
                        <p className="text-xs text-muted-foreground">Editor Interactivo de Zonas</p>
                    </div>
                </div>
            </div>

            <AreaMapEditor
                areaId={area.id}
                imageUrl={area.imagen_url}
                initialZones={zones || []}
            />
        </div>
    )
}
