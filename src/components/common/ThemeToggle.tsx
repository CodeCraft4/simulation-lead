import { Moon, Sun } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { useTheme } from '@hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <Button variant="secondary" size="sm" onClick={toggleTheme} aria-label={`Switch to ${next} theme`} className="h-8 w-8 rounded-lg px-0">
      {theme === 'dark' ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </Button>
  )
}
