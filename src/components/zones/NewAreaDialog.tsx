'use client'

import { createArea } from '@/app/(dashboard)/zones/actions'
import { useState, useRef } from 'react'
import { Upload, X, Loader2, Plus, Building2, FileText, Image as ImageIcon } from 'lucide-react'

export function NewAreaDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            await createArea(formData)
            setIsOpen(false)
            setPreviewUrl(null)
            formRef.current?.reset()
        } catch (error) {
            // Using standard visible alert for now, could be toast
            alert('Error al crear: Verifica los datos.')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
                <Plus className="h-4 w-4" />
                Nueva Planta
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">

                    {/* Dark Solid Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Card - Solid Colors */}
                    <div className="relative bg-white dark:bg-zinc-950 w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 z-50">

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Nueva Planta</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Sube el plano arquitectónico de tu piso.</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="h-5 w-5 text-zinc-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <form ref={formRef} action={handleSubmit} className="p-6 space-y-5">

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nombre de la Planta</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                    <input
                                        name="name"
                                        required
                                        type="text"
                                        placeholder="Ej. Piso 2 - Administrativo"
                                        className="flex h-11 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-10 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Archivo del Plano</label>
                                <div className="relative group cursor-pointer">
                                    <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-200 flex flex-col items-center justify-center text-center gap-3 ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-zinc-300 dark:border-zinc-700 hover:border-primary hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}>

                                        <input
                                            name="file"
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />

                                        {previewUrl ? (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md bg-white">
                                                <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                                    <span className="text-white font-medium text-sm flex items-center gap-2">
                                                        <Upload className="h-4 w-4" /> Cambiar imagen
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary group-hover:scale-110 transition-all">
                                                    <ImageIcon className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                        <span className="text-primary hover:underline">Haz clic para subir</span> o arrastra
                                                    </p>
                                                    <p className="text-xs text-zinc-500">Soporta PNG, JPG, WEBP (Max 5MB)</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Descripción <span className="text-zinc-400 font-normal">(Opcional)</span></label>
                                <textarea
                                    name="description"
                                    placeholder="Detalles adicionales sobre esta ubicación..."
                                    className="flex min-h-[80px] w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-3 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent resize-none placeholder:text-zinc-400"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary text-white hover:bg-primary/90 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Planta'
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
