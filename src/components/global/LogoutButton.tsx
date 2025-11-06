'use client'

import { logout } from '@/app/auth/actions'
import { LogOut } from 'lucide-react'

// We add a prop to change the styling
type LogoutButtonProps = {
  asDropdownItem?: boolean
}

export function LogoutButton({ asDropdownItem = false }: LogoutButtonProps) {
  // Define styles based on the prop
  const className = asDropdownItem
    ? 'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
    : 'flex items-center text-sm font-medium text-gray-700 hover:text-yellow-600'

  return (
    <form action={logout} className={asDropdownItem ? 'w-full' : ''}>
      <button type="submit" className={className}>
        <LogOut size={16} />
        <span>Déconnexion</span>
      </button>
    </form>
  )
}