'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

const THEME_KEY = 'mmwafrika-theme'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  const pendingTheme = useRef<'light' | 'dark'>('light')
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') { setTheme(stored); pendingTheme.current = stored; return }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = prefersDark ? 'dark' : 'light'
    setTheme(initial); pendingTheme.current = initial
  }, [])

  useEffect(() => {
    if (!mounted) return
    pendingTheme.current = theme
    if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      document.documentElement.classList.toggle('dark', pendingTheme.current === 'dark')
      localStorage.setItem(THEME_KEY, pendingTheme.current)
      rafId.current = null
    })
  }, [theme, mounted])

  const toggle = useCallback(() => { setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')) }, [])

  return { theme, toggle, mounted }
}
