import type { CueStep, SceneModule } from '@features/scenario/types'
import { CONNECTIONS, GOOGLE, META, PUBLISH } from '@features/scenes/launch/launchData'
import { LaunchStage } from '@features/scenes/launch/LaunchStage'

const FIELD_MS = 750

/** Fill each field of a campaign one by one, then show its ad preview. */
const fillCampaign = (key: string, fieldCount: number): CueStep[] =>
  Array.from({ length: fieldCount + 1 }, (_, i) => ({
    after: i === 0 ? 200 : FIELD_MS,
    run: (api) => api.setVar(key, i + 1),
  }))

export const launchScene: SceneModule = {
  startTime: 9 * 3600 + 20 * 60,
  initialVars: { metaStep: 0, googleStep: 0, connected: 0, publish: PUBLISH.draft, publishedAt: 0 },
  cueSteps: {
    meta: fillCampaign('metaStep', META.fields.length),
    google: fillCampaign('googleStep', GOOGLE.fields.length),
    connect: CONNECTIONS.map((_, i) => ({
      after: i === 0 ? 200 : 650,
      run: (api) => api.setVar('connected', i + 1),
    })),
    publish: [
      { after: 0, run: (api) => api.setVar('publish', PUBLISH.review) },
      {
        after: 1400,
        run: (api) => {
          api.setVar('publish', PUBLISH.active)
          api.setVar('publishedAt', api.now())
          api.setFlow('ad', 'active')
          // Fast clock so spend, reach and clicks visibly climb.
          api.startClock(300)
        },
      },
      { after: 1200, run: () => {} },
    ],
  },
  Stage: LaunchStage,
  design: { width: 1000, height: 672 },
}
