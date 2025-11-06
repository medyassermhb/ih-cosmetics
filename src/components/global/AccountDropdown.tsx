'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { User, LogOut, ChevronDown, Package } from 'lucide-react'
import { LogoutButton } from './LogoutButton' // We'll re-use this

type AccountDropdownProps = {
  userRole: 'client' | 'admin'
  accountHref: string
}

export function AccountDropdown({ userRole, accountHref }: AccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const buttonText = userRole === 'admin' ? 'Admin' : 'Compte'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownRef])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. The Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-yellow-600"
        aria-label="Ouvrir le menu du compte"
      >
        <User size={16} />
        <span>{buttonText}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 2. The Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Link
              href={accountHref}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)} // Close on click
            >
              <Package size={16} />
              {userRole === 'admin' ? 'Dashboard' : 'Mes Commandes'}
            </Link>
            
            {/* We pass a new prop to style the logout button for the dropdown */}
            <LogoutButton asDropdownItem={true} />
          </div>
        </div>
      )}
    </div>
  )
}