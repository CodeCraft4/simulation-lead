/** Every URL in the app lives here, so links never hard-code paths. */
export const ROUTES = {
  home: '/',
  scene: (sceneId: string) => `/scenes/${sceneId}`,
  scenePattern: '/scenes/:sceneId',
  /** The clickable mobile app; its screens are local state, not URLs. */
  app: '/app',
} as const
