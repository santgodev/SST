🚀 SaaS Starter Kit(Next.js + Supabase + Tailwind)
Guarda este documento.Es tu "receta maestra" para iniciar cualquier proyecto futuro con:

Autenticación completa(Login / Register / Logout)
Diseño Premium(Glassmorphism, Dark Mode)
Dashboard Layout(Sidebar + Navbar)
Seguridad RLS y Perfiles
1. Base de Datos(Supabase SQL)
Corre esto en el SQL Editor de tu nuevo proyecto para configurar Auth.

--1. TABLA PROFILES
CREATE TABLE IF NOT EXISTS public.profiles(
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'viewer', -- 'admin', 'inspector', 'viewer'
  created_at TIMESTAMPTZ DEFAULT now()
);
--2. TRIGGER AUTOMÁTICO(Nuevo Usuario -> Nuevo Perfil)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles(id, full_name, role)
VALUES(new.id, new.raw_user_meta_data ->> 'full_name', 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
--3. SEGURIDAD(RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios ven su propio perfil" ON public.profiles
  FOR SELECT USING(auth.uid() = id);
CREATE POLICY "Usuarios editan su propio perfil" ON public.profiles
  FOR UPDATE USING(auth.uid() = id);
2. Configuración(Archivos Base)
src / lib / supabase / client.ts
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
src / lib / supabase / server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export const createClient = async () => {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch { }
                },
            },
        }
    )
}
src / middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
export async function middleware(request: NextRequest) {
    return await updateSession(request)
}
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
3. Lógica de Auth
src / app / auth / actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
export async function login(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }
    revalidatePath('/', 'layout')
    redirect('/')
}
export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
        },
    })
    if (error) {
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }
    return redirect('/login?message=Check email to continue')
}
export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
4. UI Components(El Diseño "Lindo")
Para reutilizar el diseño, copia estas carpetas enteras de tu proyecto actual:

Login Form:
src / components / auth / AuthForm.tsx
    (El formulario con tabs)
Login Page:
src / app / login / page.tsx
    (El wrapper con fondo dividido)
Layout:
src / components / layout / Sidebar.tsx
y
Navbar.tsx
Estilos: Tu
src / app / globals.css
    (con la configuración de Tailwind v4)
💡 Cómo usarlo en un proyecto nuevo
Crea el proyecto: npx create - next - app@latest mi - saas
Instala dependencias: npm install @supabase/ssr lucide-react
Copia los archivos de este documento.
¡Listo! Tienes un sistema de usuarios profesional en 5 minutos.