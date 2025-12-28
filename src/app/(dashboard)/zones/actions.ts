'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createArea(formData: FormData) {
    const supabase = await createClient()

    // 1. Get User & Company
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: membership } = await supabase
        .from('miembros_empresa')
        .select('empresa_id')
        .eq('usuario_id', user.id)
        .single()

    if (!membership) throw new Error('No perteneces a una empresa')

    // 2. Extract Data
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
        throw new Error('Debes subir una imagen del plano')
    }

    // 3. Upload to Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${membership.empresa_id}/${Date.now()}.${fileExt}`

    const { error: uploadError, data: uploadData } = await supabase
        .storage
        .from('blueprints')
        .upload(fileName, file)

    if (uploadError) {
        console.error('Storage Error:', uploadError)
        throw new Error('Error al subir la imagen')
    }

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from('blueprints')
        .getPublicUrl(fileName)

    // 5. Insert into DB
    const { error: dbError } = await supabase
        .from('areas')
        .insert({
            empresa_id: membership.empresa_id,
            nombre: name,
            descripcion: description,
            imagen_url: publicUrl
        })

    if (dbError) {
        console.error('DB Error:', dbError)
        throw new Error('Error al guardar el área en base de datos')
    }

    revalidatePath('/zones')
    return { success: true }
}

export async function saveZone(zoneData: any) {
    const supabase = await createClient()

    // Validar permisos (Basic check)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('zonas')
        .insert({
            area_id: zoneData.areaId,
            nombre: zoneData.name,
            tipo: zoneData.type,
            riesgo: zoneData.riskLevel,
            posicion_x: zoneData.x,
            posicion_y: zoneData.y
        })

    if (error) {
        console.error('Save user error:', error)
        throw new Error('Error al guardar zona')
    }

    revalidatePath(`/zones/${zoneData.areaId}`)
    return { success: true }
}

export async function updateZonePosition(zoneId: string, areaId: string, x: number, y: number) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('zonas')
        .update({ posicion_x: x, posicion_y: y })
        .eq('id', zoneId)

    if (error) throw new Error('Error updating zone position')

    revalidatePath(`/zones/${areaId}`)
    return { success: true }
}

export async function deleteZone(zoneId: string, areaId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('zonas').delete().eq('id', zoneId)

    if (error) throw new Error('Error deleting zone')

    revalidatePath(`/zones/${areaId}`)
    return { success: true }
}

export async function deleteArea(areaId: string) {
    const supabase = await createClient()

    // RLS will handle permission checks, but we should wrap in try/catch if needed
    const { error } = await supabase
        .from('areas')
        .delete()
        .eq('id', areaId)

    if (error) {
        console.error('Delete Error:', error)
        throw new Error('No se pudo eliminar el área')
    }

    revalidatePath('/zones')
}
