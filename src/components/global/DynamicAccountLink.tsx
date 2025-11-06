'use client'

import { createClient } from '@/lib/supabase-client' // Use the BROWSER client
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function DynamicAccountLink() {
  const [href, setHref] = useState('/account/orders')
  const [text, setText] = useState('Voir mes commandes')

  useEffect(() => {
    // This function runs in the user's browser
    const checkUserRole = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'admin') {
          setHref('/admin/orders')
          setText('Tableau de bord Admin')
        }
      }
    }

    checkUserRole()
  }, []) // Runs once on component mount

  return (
    <Link
      href={href}
      className="mr-4 rounded-md bg-yellow-700 px-6 py-3 text-white shadow-sm hover:bg-yellow-800"
    >
      {text}
    </Link>
  )
}