import type { WaMessage } from '@components/whatsapp/WaChat'

/**
 * The first `count` messages of a scripted chat. A reply button only shows as chosen
 * once the customer's answer (the next message) is on screen.
 */
export function revealChat(script: WaMessage[], count: number): WaMessage[] {
  return script.slice(0, count).map((m, i) => (m.kind === 'in' && m.chosen && i >= count - 1 ? { ...m, chosen: undefined } : m))
}
