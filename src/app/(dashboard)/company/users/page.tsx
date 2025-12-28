import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RoleSelector } from '@/components/company/RoleSelector'
import { Shield, ShieldAlert, User, MoreVertical } from 'lucide-react'

export default async function CompanyUsersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    // 1. Obtener mi empresa (Asumimos la primera por simplicidad para MVP)
    const { data: membership } = await supabase
        .from('miembros_empresa')
        .select('empresa_id, rol')
        .eq('usuario_id', user.id)
        .single()

    if (!membership) return <div className="p-8">No perteneces a una empresa.</div>

    const isAdmin = membership.rol === 'admin'

    // Security Gate: Only admins can manage users
    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="bg-red-100 p-3 rounded-full">
                    <ShieldAlert className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold">Acceso Restringido</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                    Solo los administradores de la empresa pueden gestionar usuarios y permisos.
                    Ponte en contacto con el propietario si necesitas acceso.
                </p>
                <Link href="/" className="text-primary hover:underline text-sm font-medium">
                    Volver al Dashboard
                </Link>
            </div>
        )
    }

    // 2. Obtener todos los miembros
    // Hacemos JOIN con 'profiles' si existiera, o usamos un mock visual si 'profiles' no tiene datos sync
    // Como auth.users no es accesible directamente, usamos el correo de miembros_empresa si lo guardamos, 
    // o profiles. (Para este ejemplo asumo que profiles está poblado)
    const { data: members, error: membersError } = await supabase
        .from('miembros_empresa')
        .select(`
        id, 
        rol, 
        usuario_id,
        profiles ( full_name, email ) 
    `)
        .eq('empresa_id', membership.empresa_id)

    if (membersError) {
        console.error('Error fetching members:', membersError)
    }

    console.log('Members found:', members?.length, members)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Usuarios & Permisos</h2>
                    <p className="text-muted-foreground">Gestiona quién tiene acceso a tu empresa.</p>
                </div>
                {isAdmin && (
                    <Link
                        href="/company/users/invite"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Invitar Usuario
                    </Link>
                )}
            </div>

            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 border-b text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Rol Actual</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {(!members || members.length === 0) ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                    No se encontraron usuarios. {membersError ? 'Error de permisos.' : 'La lista está vacía.'}
                                </td>
                            </tr>
                        ) : members.map((member: any) => (
                            <tr key={member.id} className="group hover:bg-secondary/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-zinc-900">
                                                {member.profiles?.full_name || 'Sin Nombre'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {member.profiles?.email || 'Email oculto'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {isAdmin ? (
                                        <RoleSelector memberId={member.id} currentRole={member.rol} />
                                    ) : (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${member.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {member.rol}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-zinc-400 hover:text-zinc-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
