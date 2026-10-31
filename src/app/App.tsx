import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { ThemeProvider } from '@app/providers/ThemeProvider'
import { router } from '@app/router'
import { primeAudio } from '@lib/sfx'
import { unlockSound } from '@lib/voice'

export function App() {
  // Browsers allow sound only after the page is clicked or a key is pressed.
  useEffect(() => {
    const unlock = () => {
      primeAudio()
      unlockSound()
    }
    window.addEventListener('pointerdown', unlock, true)
    window.addEventListener('keydown', unlock, true)
    return () => {
      window.removeEventListener('pointerdown', unlock, true)
      window.removeEventListener('keydown', unlock, true)
    }
  }, [])

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
