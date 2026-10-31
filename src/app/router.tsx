import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@config/routes'
import { MobileAppLayout } from '@layouts/MobileAppLayout'
import { PresenterLayout } from '@layouts/PresenterLayout'
import { NotFoundPage } from '@pages/NotFoundPage'
import { ScenePage } from '@pages/presenter/ScenePage'
import { ScenesPage } from '@pages/presenter/ScenesPage'

export const router = createBrowserRouter([
  // A scene is full screen with its own top bar, so it sits outside PresenterLayout.
  { path: ROUTES.scenePattern, element: <ScenePage /> },
  {
    element: <PresenterLayout />,
    children: [
      { path: ROUTES.home, element: <ScenesPage /> },
      { path: `${ROUTES.app}/*`, element: <MobileAppLayout /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
