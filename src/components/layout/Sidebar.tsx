'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck, LayoutDashboard, ClipboardCheck, Siren, BarChart3, Settings, Building2, Map, User, PlusCircle } from 'lucide-react'

// Definimos los items con un campo opcional 'roles' que es un array de roles permitidos
// Si 'roles' no existe, es público para cualquier miembro
const allNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Inspecciones', href: '/inspections', icon: ClipboardCheck },
    { name: 'Zonas & Mapas', href: '/zones', icon: Map },
    { name: 'Accidentes', href: '/accidents', icon: Siren },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
    { name: 'Usuarios', href: '/company/users', icon: User, roles: ['admin'] }, // SOLO ADMIN
    { name: 'Empresa', href: '/company', icon: Building2 },
    { name: 'Nueva Empresa', href: '/company/new', icon: PlusCircle },
    { name: 'Configuración', href: '/settings', icon: Settings },
]

interface SidebarProps {
    userEmail: string | undefined
    userName: string | null
    userRole: string | null
}

export function Sidebar({ userEmail, userName, userRole }: SidebarProps) {
    const pathname = usePathname()

    // Filter navigation based on role
    // If item has no roles defined, everyone sees it.
    // If it has roles, userRole must be in the list.
    const navigation = allNavigation.filter(item => {
        // Logic: If user belongs to a company (has role), hide "New Company"
        if (item.href === '/company/new' && userRole) return false;

        // Logic: Role based access (e.g. Users only for Admin)
        if (item.roles && !item.roles.includes(userRole as any)) return false;

        return true
    })

    const initials = userName
        ? userName.substring(0, 2).toUpperCase()
        : userEmail?.substring(0, 2).toUpperCase() || 'U'

    return (
        <div className="hidden border-r bg-zinc-950/95 backdrop-blur-xl lg:block lg:w-72">
            <div className="flex h-full flex-col gap-2">

                {/* Header / Logo */}
                <div className="flex h-16 items-center border-b border-zinc-800 px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg tracking-tight text-white">SST Next</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-auto py-4 px-3">
                    <nav className="grid gap-1">
                        <div className="px-3 mb-2">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Menú Principal</p>
                        </div>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-indigo-600/10 text-indigo-400 shadow-sm border border-indigo-500/10'
                                        : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100'
                                        }`}
                                >
                                    <item.icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Footer / User Info Mini */}
                <div className="border-t border-zinc-800 p-4">
                    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-xs font-bold text-zinc-400">{initials}</span>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-medium text-zinc-200 truncate">{userName || 'Usuario'}</span>
                                <span className="text-[10px] text-zinc-500 capitalize">{userRole || 'Miembro'}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
