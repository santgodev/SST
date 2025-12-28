'use client'

import { createCompany } from '@/app/(dashboard)/company/actions'
import { Building2, MapPin, Phone, Mail, FileText, Loader2, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function NewCompanyForm() {
    const [isLoading, setIsLoading] = useState(false)
    const handleSubmit = () => setIsLoading(true)

    return (
        <div className="max-w-2xl mx-auto space-y-8">

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Registrar Nueva Empresa</h1>
                <p className="text-muted-foreground">
                    Crea un espacio de trabajo para gestionar inspecciones y seguridad.
                </p>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">

                    <form action={createCompany} onSubmit={handleSubmit} className="space-y-6">

                        {/* Nombre & NIT Row */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="nombre">
                                    Nombre de la Empresa
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        placeholder="Ej. Constructora Global SAS"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-9 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="nit">
                                    NIT / Identificación
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="nit"
                                        name="nit"
                                        type="text"
                                        placeholder="900.123.456-7"
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-9 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="direccion">
                                Dirección Principal
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="direccion"
                                    name="direccion"
                                    type="text"
                                    placeholder="Calle 123 # 45-67, Bogotá"
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-9 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Contacto Row */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="telefono">
                                    Teléfono
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="telefono"
                                        name="telefono"
                                        type="tel"
                                        placeholder="(601) 123 4567"
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-9 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="email">
                                    Email Corporativo
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="contacto@empresa.com"
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-9 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creando Espacio...
                                    </>
                                ) : (
                                    <>
                                        Crear Empresa
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
