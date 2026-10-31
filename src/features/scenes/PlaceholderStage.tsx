import { Hammer } from 'lucide-react'

/** Stage for scenes that are not built yet. Cues still tick over so the flow can be rehearsed. */
export function PlaceholderStage() {
  return (
    <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-line bg-surface p-8 text-center">
      <div className="max-w-sm">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-surface-2 text-ink-3">
          <Hammer className="size-6" aria-hidden />
        </span>
        <p className="mt-4 text-lg font-bold">This scene is built next</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-3">
          The cues on the right already work, so the full story can be rehearsed. Devices and animations come in the next step.
        </p>
      </div>
    </div>
  )
}
