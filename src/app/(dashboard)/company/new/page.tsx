import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewCompanyForm } from '@/components/company/NewCompanyForm'

export default async function NewCompanyPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Check if user already has a company
    const { data: existingMembership } = await supabase
        .from('miembros_empresa')
        .select('id')
        .eq('usuario_id', user.id)
        .single()

    if (existingMembership) {
        redirect('/')
    }

    return (
        <NewCompanyForm />
    )
}
