import { useEffect, useState } from 'react'

interface FitOptions {
  /** Height of the element; when given, it must fit the viewport height too. */
  height?: number
  /** Space to leave around the element, horizontally and vertically. */
  gutter?: number
  reserveY?: number
  max?: number
}

const fit = (width: number, { height, gutter = 16, reserveY = 0, max = 1 }: FitOptions) => {
  const byWidth = (window.innerWidth - gutter * 2) / width
  const byHeight = height ? (window.innerHeight - reserveY) / height : Infinity
  return Math.min(max, byWidth, byHeight)
}

/** Scale that makes an element of `width` (and optionally `height`) fit the viewport. */
export function useFitScale(width: number, options: FitOptions = {}) {
  const { height, gutter, reserveY, max } = options
  const [scale, setScale] = useState(() => fit(width, options))

  useEffect(() => {
    const onResize = () => setScale(fit(width, { height, gutter, reserveY, max }))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [width, height, gutter, reserveY, max])

  return scale
}
