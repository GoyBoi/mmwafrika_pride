'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function EnvironmentProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const isPetEnv = pathname.includes('/pets') || pathname.includes('/pet-')
    document.body.classList.toggle('env-pets', isPetEnv)
    return () => { document.body.classList.remove('env-pets') }
  }, [pathname])

  return null
}
