'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCompany(formData: FormData) {
    const supabase = await createClient()

    // 1. Get Current User
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return redirect('/login')
    }

    // 2. Extract Data
    const nombre = formData.get('nombre') as string
    const nit = formData.get('nit') as string
    const direccion = formData.get('direccion') as string
    const telefono = formData.get('telefono') as string
    const email = formData.get('email') as string

    // 3. Create Company via RPC (Atomic & Bypass RLS)
    const { data: companyId, error: rpcError } = await supabase.rpc('create_company_new', {
        _nombre: nombre,
        _nit: nit,
        _direccion: direccion,
        _telefono: telefono,
        _email: email
    })

    if (rpcError) {
        console.error('Error creating company (RPC):', rpcError)
        return redirect(`/company/new?error=${encodeURIComponent(rpcError.message)}`)
    }

    // 4. Success -> Redirect
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function updateMemberRole(formData: FormData) {
    const supabase = await createClient()
    const memberId = formData.get('member_id') as string
    const newRole = formData.get('new_role') as string

    // RLS in Supabase ensures only admins can do this
    const { error } = await supabase
        .from('miembros_empresa')
        .update({ rol: newRole })
        .eq('id', memberId)

    if (error) {
        console.error('Error updating role:', error)
        // In real app, handle error
        return
    }

    revalidatePath('/company/users')
    revalidatePath('/company/users/invite')
    redirect('/company/users')
}

export async function inviteUser(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const role = formData.get('role') as string

    if (!email || !role) {
        return redirect('/company/users/invite?error=Email and Role are required')
    }

    // 1. Resolve User ID from Email (via RPC)
    const { data: userId, error: lookupError } = await supabase.rpc('get_user_id_by_email', {
        _email: email
    })

    if (lookupError || !userId) {
        console.error('User lookup failed:', lookupError)
        return redirect(`/company/users/invite?error=${encodeURIComponent('Usuario no encontrado. Asegúrate de que ya esté registrado en la plataforma.')}`)
    }

    // 2. Get Current Company
    // For this MVP, we assume the user is inviting to their first/main company.
    // Ideally we pass company_id as hidden field, but for now we look it up.
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: membership } = await supabase
        .from('miembros_empresa')
        .select('empresa_id')
        .eq('usuario_id', user.id)
        .eq('rol', 'admin') // Security check: Only admins can invite
        .single()

    if (!membership) {
        return redirect(`/company/users/invite?error=${encodeURIComponent('No tienes permisos de administrador.')}`)
    }

    // 3. Insert Member
    const { error: insertError } = await supabase
        .from('miembros_empresa')
        .insert({
            usuario_id: userId,
            empresa_id: membership.empresa_id,
            rol: role
        })

    if (insertError) {
        // Handle unique constraint violation (already member)
        if (insertError.code === '23505') {
            return redirect(`/company/users/invite?error=${encodeURIComponent('Este usuario ya es miembro de la empresa.')}`)
        }
        console.error('Invite error:', insertError)
        return redirect(`/company/users/invite?error=${encodeURIComponent(insertError.message)}`)
    }

    // 4. Success
    revalidatePath('/company/users')
    redirect('/company/users')
}
