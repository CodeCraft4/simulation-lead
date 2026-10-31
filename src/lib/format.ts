/** Simulated day 0 is Sat 31 Oct 2026; simulated time is seconds since its midnight. */
const SIM_DAY_ZERO = new Date(2026, 9, 31)

const toDate = (simSeconds: number) => new Date(SIM_DAY_ZERO.getTime() + simSeconds * 1000)

/** "Sat 31 Oct" */
export function formatSimDate(simSeconds: number) {
  return toDate(simSeconds).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '')
}

/** "9:05 am" */
export function formatSimTime(simSeconds: number) {
  const d = toDate(simSeconds)
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h % 12 || 12}:${m} ${h < 12 ? 'am' : 'pm'}`
}

/** 252 → "04:12" */
export function formatDuration(seconds: number) {
  const s = Math.floor(seconds)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

const trim = (n: number) => String(Number(n.toFixed(2)))

/** PKR with lakh and crore: 1950000 → "PKR 19.5 lakh", 19500000 → "PKR 1.95 crore". */
export function formatPKR(amount: number) {
  if (amount >= 1e7) return `PKR ${trim(amount / 1e7)} crore`
  if (amount >= 1e5) return `PKR ${trim(amount / 1e5)} lakh`
  return `PKR ${Math.round(amount).toLocaleString('en-US')}`
}
