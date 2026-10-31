import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CuePanel } from '@components/presenter/CuePanel'
import { FlowMap } from '@components/presenter/FlowMap'
import { TopBar } from '@components/presenter/TopBar'
import { FitStage } from '@components/stage/FitStage'
import { ROUTES } from '@config/routes'
import { findScene } from '@data/scenes'
import { loadScene, setSceneNavigator } from '@features/scenario/director'
import { cancelAll } from '@features/scenario/timers'
import { useSim } from '@features/scenario/store'
import { useClockTicker } from '@features/scenario/useClockTicker'
import { useShortcuts } from '@features/scenario/useShortcuts'
import { getSceneModule } from '@features/scenes/registry'
import { stopVoice } from '@lib/voice'
import { NotFoundPage } from '@pages/NotFoundPage'

/**
 * Full-screen presenter view of one scene. The page is exactly one screen tall (100dvh):
 * the stage scales to fit, so nothing scrolls on a laptop or projector.
 */
export function ScenePage() {
  const { sceneId } = useParams()
  const scene = findScene(sceneId)
  const navigate = useNavigate()
  const loadedId = useSim((s) => s.sceneId)

  const goToScene = useCallback((id: string) => navigate(ROUTES.scene(id)), [navigate])

  useEffect(() => setSceneNavigator(goToScene), [goToScene])
  useEffect(() => {
    if (scene) loadScene(scene.id)
  }, [scene])
  useEffect(
    () => () => {
      cancelAll()
      stopVoice()
    },
    [],
  )
  useClockTicker()
  useShortcuts(goToScene)

  if (!scene) return <NotFoundPage />

  // Wait one render for loadScene so the stage never shows the previous scene's state.
  const ready = loadedId === scene.id
  const { Stage, design } = getSceneModule(scene.id)

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar />
      {/* Below lg the cue panel drops under the stage and only this area scrolls. */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:flex-row lg:overflow-hidden">
        <main className="flex min-w-0 flex-col gap-3 lg:min-h-0 lg:flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-[62vh] min-h-0 flex-col gap-3 lg:h-auto lg:flex-1"
            >
              <div className="shrink-0">
                <p className="text-xs font-semibold text-ink-3">
                  Scene {scene.number} · {scene.title}
                </p>
                <h1 className="mt-1 text-xl font-bold tracking-tight xl:text-2xl">{scene.headline}</h1>
              </div>
              <div className="min-h-0 flex-1">
                {ready && (
                  <FitStage width={design.width} height={design.height}>
                    <Stage />
                  </FitStage>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
        <div className="shrink-0 lg:min-h-0 lg:w-[300px] lg:overflow-y-auto">
          <CuePanel scene={scene} />
        </div>
      </div>
      <FlowMap />
    </div>
  )
}
