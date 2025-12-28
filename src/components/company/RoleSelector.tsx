'use client'

import { updateMemberRole } from '@/app/(dashboard)/company/actions'

export function RoleSelector({ memberId, currentRole }: { memberId: string, currentRole: string }) {
    return (
        <form action={updateMemberRole}>
            <input type="hidden" name="member_id" value={memberId} />
            <select
                name="new_role"
                defaultValue={currentRole}
                className="bg-transparent border border-zinc-200 rounded-md py-1 px-2 text-sm focus:ring-2 ring-primary outline-none cursor-pointer hover:border-zinc-300"
                onChange={(e) => e.target.form?.requestSubmit()}
            >
                <option value="admin">Administrador</option>
                <option value="inspector">Inspector</option>
                <option value="viewer">Observador</option>
            </select>
        </form>
    )
}
