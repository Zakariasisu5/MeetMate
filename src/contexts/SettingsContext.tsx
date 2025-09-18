import React, { createContext, useContext, useEffect, useState } from 'react'

type ThemeOption = 'system' | 'light' | 'dark'

type Settings = {
  theme: ThemeOption
  marqueeEnabled: boolean
  marqueeSpeed: number // 1-100
  notificationsEnabled: boolean
}

type SettingsContextValue = {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  reset: () => void
}

const STORAGE_KEY = 'meetmate:settings'

const defaultSettings: Settings = {
  theme: 'system',
  marqueeEnabled: true,
  marqueeSpeed: 40,
  notificationsEnabled: true,
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
    } catch (e) {
      // ignore
    }
    return defaultSettings
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      // ignore
    }
  }, [settings])

  // Apply global UI settings (theme, marquee speed/play state)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const doc = document.documentElement

    // Theme handling: support 'system' by listening to prefers-color-scheme
    const applyTheme = (theme: typeof settings.theme) => {
      if (theme === 'dark') {
        doc.classList.add('dark')
      } else if (theme === 'light') {
        doc.classList.remove('dark')
      } else {
        // system
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) doc.classList.add('dark')
        else doc.classList.remove('dark')
      }
    }

    applyTheme(settings.theme)

    let mql: MediaQueryList | null = null
    const onPrefChange = (e: MediaQueryListEvent) => {
      if (settings.theme === 'system') {
        if (e.matches) doc.classList.add('dark')
        else doc.classList.remove('dark')
      }
    }
    if (window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: dark)')
      try {
        mql.addEventListener ? mql.addEventListener('change', onPrefChange) : mql.addListener(onPrefChange)
      } catch (e) {
        // ignore
      }
    }

    // Map marqueeSpeed (10-100) to durations
    const ms = settings.marqueeSpeed
    const marqueeDuration = Math.max(6, Math.round((110 - ms) * 0.6))
    const sponsorSpeed = Math.max(6, Math.round((110 - ms) * 0.36))

    doc.style.setProperty('--marquee-duration', `${marqueeDuration}s`)
    doc.style.setProperty('--sponsor-speed', `${sponsorSpeed}s`)

    // Pause / play animations via CSS variable
    doc.style.setProperty('--marquee-play-state', settings.marqueeEnabled ? 'running' : 'paused')

    return () => {
      if (mql) {
        try {
          mql.removeEventListener ? mql.removeEventListener('change', onPrefChange) : mql.removeListener(onPrefChange)
        } catch (e) {
          // ignore
        }
      }
    }
  }, [settings.theme, settings.marqueeSpeed, settings.marqueeEnabled])

  const update = (patch: Partial<Settings>) => setSettings(prev => ({ ...prev, ...patch }))

  const reset = () => setSettings(defaultSettings)

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

export type { Settings, ThemeOption }
