'use client'

import { logout } from '@/app/auth/actions'
import { Bell, Search, Menu, LogOut, User } from 'lucide-react'

export function Navbar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background/80 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">

            <button className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
                <Menu className="h-5 w-5" />
            </button>

            {/* Search Bar (Fake) */}
            <div className="w-full flex-1">
                <div className="relative w-full max-w-sm hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Buscar reportes, zonas..."
                        className="w-full rounded-xl border border-input bg-secondary/50 pl-9 pr-4 h-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                <div className="flex items-center gap-2">
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-full border border-input bg-background hover:bg-zinc-100 hover:text-red-500 px-3 py-1.5 text-xs font-medium shadow-sm transition-colors text-zinc-600"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Salir
                        </button>
                    </form>
                </div>
            </div>
        </header>
    )
}
