'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Type-casting here for convenience
    // In a real app, you might want to validate the inputs e.g. with Zod
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login Error:', error.message)
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    console.log('Login successful, redirecting to /')
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const origin = (await headers()).get('origin')
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        console.error('Signup Error:', error.message)
        return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    return redirect('/login?message=Check email to continue sign in process')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}
