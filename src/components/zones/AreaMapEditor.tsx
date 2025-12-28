'use client'

import { useState, useRef, useEffect } from 'react'
import { saveZone, updateZonePosition, deleteZone } from '@/app/(dashboard)/zones/actions'
import { Plus, Save, MapPin, AlertTriangle, Info, FireExtinguisher, X, GripVertical, Trash2, AlertCircle } from 'lucide-react'

// Types based on DB
interface Zone {
    id?: string
    nombre: string
    tipo: 'general' | 'peligro' | 'extintor' | 'salida'
    riesgo: 'bajo' | 'medio' | 'alto'
    posicion_x: number
    posicion_y: number
}

interface AreaMapEditorProps {
    areaId: string
    imageUrl: string
    initialZones: Zone[]
}

export function AreaMapEditor({ areaId, imageUrl, initialZones }: AreaMapEditorProps) {
    const [zones, setZones] = useState<Zone[]>(initialZones)
    const [isAdding, setIsAdding] = useState(false)
    const [newZonePos, setNewZonePos] = useState<{ x: number, y: number } | null>(null)
    const [draggingId, setDraggingId] = useState<string | null>(null)

    // Delete Confirmation State
    const [zoneToDelete, setZoneToDelete] = useState<string | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)

    // HANDLE CLICK TO ADD
    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent adding if dragging
        if (draggingId) return;

        if (!isAdding || !containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        setNewZonePos({ x, y })
    }

    // HANDLE SAVE NEW
    const handleSaveNewZone = async (formData: FormData) => {
        if (!newZonePos) return

        const name = formData.get('name') as string
        const type = formData.get('type') as any
        const risk = formData.get('risk') as any

        const newZone = {
            areaId,
            name,
            type,
            riskLevel: risk,
            x: newZonePos.x,
            y: newZonePos.y
        }

        try {
            await saveZone(newZone)
            window.location.reload() // Reload to get ID
        } catch (error) {
            alert('Error al guardar zona')
        }
    }

    // HANDLE DELETE
    const confirmDelete = async () => {
        if (!zoneToDelete) return
        try {
            await deleteZone(zoneToDelete, areaId)
            setZones(zones.filter(z => z.id !== zoneToDelete))
            setZoneToDelete(null)
        } catch (error) {
            alert('Error al eliminar')
        }
    }

    // HANDLE DRAG START
    const handleDragStart = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (!id) return
        setDraggingId(id)
    }

    // HANDLE DRAG MOVE (Global)
    const handleMouseMove = (e: MouseEvent) => {
        if (!draggingId || !containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()

        // Calculate new position relative to container
        let x = ((e.clientX - rect.left) / rect.width) * 100
        let y = ((e.clientY - rect.top) / rect.height) * 100

        // Clamp values
        x = Math.max(0, Math.min(100, x))
        y = Math.max(0, Math.min(100, y))

        setZones(prev => prev.map(z => z.id === draggingId ? { ...z, posicion_x: x, posicion_y: y } : z))
    }

    // HANDLE DRAG END
    const handleMouseUp = async () => {
        if (!draggingId) return

        const zone = zones.find(z => z.id === draggingId)
        if (zone && zone.id) {
            // Persist position
            try {
                await updateZonePosition(zone.id, areaId, zone.posicion_x, zone.posicion_y)
            } catch (err) {
                console.error("Failed to save position")
            }
        }
        setDraggingId(null)
    }

    // Bind Global Mouse Events for Dragging
    useEffect(() => {
        if (draggingId) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [draggingId, zones])


    const getIcon = (type: string) => {
        switch (type) {
            case 'peligro': return <AlertTriangle className="h-5 w-5 text-red-500" />
            case 'extintor': return <FireExtinguisher className="h-5 w-5 text-red-600" />
            case 'salida': return <MapPin className="h-5 w-5 text-green-500" />
            default: return <Info className="h-5 w-5 text-blue-500" />
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">

            {/* Toolbar */}
            <div className="w-full lg:w-64 flex flex-col gap-4 order-2 lg:order-1">
                <div className="bg-card border rounded-xl p-4 space-y-4">
                    <h3 className="font-semibold text-sm">Herramientas</h3>

                    <button
                        onClick={() => { setIsAdding(!isAdding); setNewZonePos(null) }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isAdding ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                    >
                        {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isAdding ? 'Cancelar Agregado' : 'Agregar Zona'}
                    </button>

                    <div className="text-xs text-muted-foreground">
                        {isAdding ? 'Haz clic en el plano para colocar un marcador.' : 'Arrastra los marcadores para reubicar.'}
                    </div>
                </div>

                <div className="bg-card border rounded-xl p-4 flex-1 overflow-y-auto flex flex-col">
                    <h3 className="font-semibold text-sm mb-3">
                        {newZonePos ? 'Nueva Zona' : `Zonas Registradas (${zones.length})`}
                    </h3>

                    {newZonePos ? (
                        <div className="animate-in slide-in-from-left duration-200">
                            <form action={handleSaveNewZone} className="space-y-4">
                                <div className="p-3 bg-primary/10 rounded-lg mb-3">
                                    <p className="text-xs text-primary font-medium">Marcador colocado</p>
                                    <p className="text-[10px] text-muted-foreground">Completa los datos abajo</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Nombre</label>
                                    <input name="name" autoFocus placeholder="Ej. Extintor P. Baja" required className="w-full text-xs p-2 border rounded bg-transparent" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Tipo</label>
                                    <select name="type" className="w-full text-xs p-2 border rounded bg-transparent" defaultValue="general">
                                        <option value="general">General</option>
                                        <option value="peligro">Peligro / Riesgo</option>
                                        <option value="extintor">Extintor / Equipo</option>
                                        <option value="salida">Salida / Ruta</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Nivel de Riesgo</label>
                                    <select name="risk" className="w-full text-xs p-2 border rounded bg-transparent" defaultValue="bajo">
                                        <option value="bajo">Bajo</option>
                                        <option value="medio">Medio</option>
                                        <option value="alto">Alto</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => { setNewZonePos(null); setIsAdding(false); }} type="button" className="flex-1 py-1.5 text-xs border rounded hover:bg-secondary">Cancelar</button>
                                    <button type="submit" className="flex-1 bg-primary text-primary-foreground text-xs py-1.5 rounded font-medium">Guardar</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {zones.map((zone, idx) => (
                                <div key={idx} className="group/item flex items-center gap-2 p-2 rounded-lg bg-secondary/50 text-xs text-muted-foreground hover:bg-secondary transition-colors cursor-pointer border border-transparent hover:border-border">
                                    {getIcon(zone.tipo)}
                                    <span className="truncate flex-1">{zone.nombre}</span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (zone.id) setZoneToDelete(zone.id);
                                        }}
                                        className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-600 transition-opacity"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {zones.length === 0 && (
                                <p className="text-xs text-center text-muted-foreground py-8 italic">No hay zonas marcadas aun.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas / Map Area */}
            <div className="flex-1 bg-zinc-950/5 rounded-xl border relative overflow-hidden flex items-center justify-center p-8 order-1 lg:order-2">

                {/* The Map Container - Now wraps tight to image */}
                <div
                    ref={containerRef}
                    className={`relative shadow-2xl rounded-lg overflow-hidden select-none transition-cursor ${isAdding ? 'cursor-crosshair' : 'cursor-default'}`}
                    onClick={handleMapClick}
                    style={{ width: 'fit-content', height: 'fit-content' }}
                >
                    <img
                        src={imageUrl}
                        alt="Plano"
                        className="max-w-full max-h-[70vh] object-contain block"
                        draggable={false}
                    />

                    {/* Existing Zones (Draggable) */}
                    {zones.map((zone, idx) => (
                        <div
                            key={zone.id || idx}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 hover:z-20 ${draggingId === zone.id ? 'opacity-80 scale-110 cursor-grabbing' : 'cursor-grab'}`}
                            style={{ left: `${zone.posicion_x}%`, top: `${zone.posicion_y}%` }}
                            onMouseDown={(e) => handleDragStart(e, zone.id!)}
                        >
                            <div className={`bg-white p-1.5 rounded-full shadow-lg border border-zinc-200 transition-transform ${draggingId === zone.id ? 'scale-125 ring-2 ring-primary' : 'group-hover:scale-110'}`}>
                                {getIcon(zone.tipo)}
                            </div>

                            {!draggingId && (
                                <div className="opacity-0 group-hover:opacity-100 absolute top-full mt-1 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity">
                                    {zone.nombre}
                                    <span className="block text-zinc-400 text-[8px]">{zone.tipo}</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Visual marker for pending click */}
                    {newZonePos && (
                        <div
                            className="absolute w-3 h-3 bg-primary rounded-full ring-4 ring-primary/30 animate-pulse transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${newZonePos.x}%`, top: `${newZonePos.y}%` }}
                        />
                    )}

                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {zoneToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-sm rounded-lg border shadow-lg p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold">¿Eliminar Zona?</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Esta acción no se puede deshacer. La zona y sus datos asociados serán eliminados permanentemente.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setZoneToDelete(null)}
                                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
