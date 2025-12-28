'use client'

import { inviteUser } from '../../actions'
import { COMPANY_ROLES } from '@/lib/constants'
import { useState } from 'react'
import { Loader2, Mail, UserPlus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function InviteUserPage() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="max-w-xl mx-auto space-y-8">

            <div>
                <Link href="/company/users" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Usuarios
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Invitar Miembro</h1>
                <p className="text-muted-foreground">
                    Agrega a un usuario existente a tu equipo mediante su correo electrónico.
                </p>
            </div>

            <div className="bg-card border rounded-xl shadow-sm p-6 sm:p-8">
                <form action={inviteUser} onSubmit={() => setIsLoading(true)} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">
                            Correo Electrónico del Usuario
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="colega@empresa.com"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-9 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            El usuario ya debe estar registrado en la plataforma.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Rol Asignado</label>
                        <div className="grid gap-3 pt-2">
                            {COMPANY_ROLES.map((role) => (
                                <label key={role.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role.value}
                                        defaultChecked={role.value === 'inspector'}
                                        className="mt-1 translate-y-0.5"
                                    />
                                    <div className="space-y-1">
                                        <span className="text-sm font-medium block">{role.label}</span>
                                        <span className="text-xs text-muted-foreground block">{role.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <UserPlus className="mr-2 h-4 w-4" />
                        )}
                        Enviar Invitación
                    </button>

                </form>
            </div>
        </div>
    )
}
