'use client'

import { useState, useEffect } from 'react'
import { login, signup } from '@/app/auth/actions'
import { ArrowRight, Mail, Lock, User, Briefcase, Loader2 } from 'lucide-react'

export function AuthForm({ message }: { message?: string }) {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [isLoading, setIsLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    // Handle smooth transition when switching modes
    const toggleMode = (newMode: 'login' | 'register') => {
        if (mode === newMode) return
        setIsAnimating(true)
        setTimeout(() => {
            setMode(newMode)
            setIsAnimating(false)
        }, 200) // Small delay for fade out
    }

    const handleSubmit = () => setIsLoading(true)

    return (
        <div className="w-full max-w-sm space-y-6">

            {/* Header & Toggle Container */}
            <div className="space-y-6">
                <div className="text-center lg:text-left space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground transition-all duration-300">
                        {mode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
                    </h1>
                    <p className="text-sm text-muted-foreground h-5">
                        {mode === 'login'
                            ? 'Ingresa tus credenciales para acceder.'
                            : 'Únete a la plataforma SST Next Gen.'}
                    </p>
                </div>

                <div className="grid grid-cols-2 p-1 bg-secondary/50 rounded-xl">
                    <button
                        onClick={() => toggleMode('login')}
                        className={`text-sm font-medium py-2.5 rounded-lg transition-all duration-300 ${mode === 'login'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => toggleMode('register')}
                        className={`text-sm font-medium py-2.5 rounded-lg transition-all duration-300 ${mode === 'register'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Registrar
                    </button>
                </div>
            </div>

            {/* Form Container with Min Height for Stability */}
            <div className="relative min-h-[320px]">
                <form
                    action={mode === 'login' ? login : signup}
                    onSubmit={handleSubmit}
                    className={`space-y-5 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                        }`}
                >

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="usuario@empresa.com"
                                    required
                                    className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-10 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                                />
                            </div>
                        </div>

                        {/* Conditional Fields: Name */}
                        <div className={`space-y-2 transition-all duration-300 overflow-hidden ${mode === 'register' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="full_name">
                                Nombre Completo
                            </label>
                            <div className="relative group">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    placeholder="Tu Nombre"
                                    required={mode === 'register'}
                                    disabled={mode === 'login'}
                                    className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-10 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-10 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Messages */}
                    {message && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-600 dark:text-red-400 border border-red-500/20 animate-in fade-in-0 slide-in-from-bottom-2">
                            {decodeURIComponent(message)}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-primary px-6 font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                    >
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                            <div className="relative h-full w-8 bg-white/20" />
                        </div>

                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        )}
                    </button>

                    {mode === 'register' && (
                        <p className="text-xs text-center text-muted-foreground">
                            Al registrarte aceptas nuestros <a href="#" className="underline hover:text-primary">Términos</a> y <a href="#" className="underline hover:text-primary">Privacidad</a>.
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
