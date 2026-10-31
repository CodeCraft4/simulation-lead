import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from '@lib/storage'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

// Only an explicit choice is stored (new key: older versions saved the system theme on load).
const STORAGE_KEY = 'lead-engine:theme-choice'

/** Light by default, whatever the system setting; dark only when the viewer picks it. */
function initialTheme(): Theme {
  return readStorage(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const chooseTheme = useCallback((next: Theme) => {
    writeStorage(STORAGE_KEY, next)
    setTheme(next)
  }, [])
  const toggleTheme = useCallback(() => chooseTheme(theme === 'dark' ? 'light' : 'dark'), [chooseTheme, theme])
  const value = useMemo(() => ({ theme, setTheme: chooseTheme, toggleTheme }), [theme, chooseTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
