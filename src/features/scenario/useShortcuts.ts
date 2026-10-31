import { useEffect } from 'react'
import { SCENES } from '@data/scenes'
import { playNextCue, resetScene } from '@features/scenario/director'
import { simActions, useSim } from '@features/scenario/store'

/** Presenter keyboard shortcuts: → next cue, ← previous scene, Space clock, R reset, 1–9 go to scene. */
export function useShortcuts(goToScene: (sceneId: string) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      const current = SCENES.find((s) => s.id === useSim.getState().sceneId)
      if (e.key === 'ArrowRight') playNextCue()
      else if (e.key === 'ArrowLeft' && current && current.number > 1) goToScene(SCENES[current.number - 2].id)
      else if (e.key === ' ') simActions.toggleClock()
      else if (e.key === 'r' || e.key === 'R') resetScene()
      else if (/^[1-9]$/.test(e.key)) goToScene(SCENES[Number(e.key) - 1].id)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goToScene])
}
