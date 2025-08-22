// Centralized game logic with time-of-day schedule, day type, negative streaks, and
// per‑scene AI generation inputs. Drop-in replacement for your previous game.ts.

export type DayType = 'School Day' | 'Weekend'
export type TimeOfDay = 'Morning' | 'Day' | 'Afternoon/Night'

export type ChoiceId = string

export type Repair = {
  text: string
  points_recovered: number // 1..3
}

export type Outcome = {
  card_id?: string
  title: string
  description: string
  points: number // −5..+5
  polarity: 'positive' | 'negative' | 'neutral'
  repair_available?: boolean
  repair_action?: Repair
  learning_note: string
}

export type SceneOption = {
  id: ChoiceId
  text: string
}

export type GeneratedScene = {
  id: string
  timeOfDay: TimeOfDay
  scenario: string
  options: SceneOption[] // exactly 2 choices (simplified); expand to 3 if you want
  consequences: Record<ChoiceId, Outcome> // one outcome per choice
}

export type PreviousSummary = {
  scenario: string
  choice_text: string
  consequence_text: string
  points_delta: number
}

export type DayPlan = {
  dayType: DayType
  // Order-preserving flat schedule; e.g. [{Morning,1},{Day,2},{Afternoon/Night,3}]
  schedule: { timeOfDay: TimeOfDay, count: number }[]
}

export type GameState = {
  plan: DayPlan
  scenes: GeneratedScene[]          // appended as they are generated
  currentIndex: number              // which scene index the UI is on
  score: number                     // clamped −20..+20
  negativeStreak: number            // consecutive <0 outcomes
  history: {
    timeOfDay: TimeOfDay
    scenario: string
    choice_id: ChoiceId | null
    choice_text: string | null
    outcome: Outcome | null
  }[]
}

export const SCORE_MIN = -20
export const SCORE_MAX =  20

// ---------- Helpers

function randInt(minInclusive: number, maxInclusive: number): number {
  return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive
}

export function chooseDayType(): DayType {
  return Math.random() < 0.5 ? 'School Day' : 'Weekend'
}

export function buildDayPlan(): DayPlan {
  const dayType = chooseDayType()
  // Ensure at least 1 scene per time-of-day and keep the day tight for kids
  const schedule = [
    { timeOfDay: 'Morning' as TimeOfDay,         count: randInt(1, 3) },
    { timeOfDay: 'Day' as TimeOfDay,             count: randInt(1, 3) },
    { timeOfDay: 'Afternoon/Night' as TimeOfDay, count: randInt(1, 3) },
  ]
  return { dayType, schedule }
}

export function initGameState(plan?: DayPlan): GameState {
  const p = plan ?? buildDayPlan()
  const totalScenes = p.schedule.reduce((acc, s) => acc + s.count, 0)
  const history = Array.from({ length: totalScenes }, () => ({
    timeOfDay: 'Morning' as TimeOfDay, // placeholder; updated as we generate
    scenario: '', choice_id: null, choice_text: null, outcome: null
  }))
  return {
    plan: p,
    scenes: [],
    currentIndex: 0,
    score: 0,
    negativeStreak: 0,
    history,
  }
}

// Return the time-of-day for the Nth scene of the day based on the plan schedule.
export function timeOfDayForIndex(plan: DayPlan, index: number): TimeOfDay {
  let acc = 0
  for (const slot of plan.schedule) {
    const start = acc
    const endExclusive = acc + slot.count
    if (index >= start && index < endExclusive) return slot.timeOfDay
    acc = endExclusive
  }
  // Fallback (should never happen)
  return plan.schedule[plan.schedule.length - 1].timeOfDay
}

// Build the request body for AI generation of the *next* scene.
export function buildSceneRequestInput(state: GameState): {
  dayType: DayType
  timeOfDay: TimeOfDay
  previous?: PreviousSummary
  negative_streak: number
  total_score: number
  must_offer_repair: boolean
} {
  const { plan, currentIndex, negativeStreak, score } = state
  const timeOfDay = timeOfDayForIndex(plan, currentIndex)

  let previous: PreviousSummary | undefined
  if (currentIndex > 0) {
    const prev = state.history[currentIndex - 1]
    previous = prev.outcome ? {
      scenario: prev.scenario,
      choice_text: prev.choice_text || '',
      consequence_text: prev.outcome.description,
      points_delta: prev.outcome.points,
    } : undefined
  }

  // Rule: after two negatives, the next scene should present an
  // obvious “make it right” path.
  const mustOfferRepair = negativeStreak >= 2

  return {
    dayType: state.plan.dayType,
    timeOfDay,
    previous,
    negative_streak: negativeStreak,
    total_score: score,
    must_offer_repair: mustOfferRepair,
  }
}

// Clamp score to bounds
function clampScore(n: number): number {
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, n))
}

// Apply a player's choice to state (synchronous, pure)
export function applyChoice(state: GameState, choiceId: ChoiceId): GameState {
  const i = state.currentIndex
  const scene = state.scenes[i]
  const outcome = scene.consequences[choiceId]
  const points = Math.max(-5, Math.min(5, outcome.points))

  const nextScore = clampScore(state.score + points)
  const nextNegStreak = points < 0 ? state.negativeStreak + 1 : 0

  const updatedHistory = [...state.history]
  updatedHistory[i] = {
    timeOfDay: scene.timeOfDay,
    scenario: scene.scenario,
    choice_id: choiceId,
    choice_text: scene.options.find(o => o.id === choiceId)?.text ?? null,
    outcome,
  }

  return {
    ...state,
    score: nextScore,
    negativeStreak: nextNegStreak,
    history: updatedHistory,
  }
}

// After applying a choice (and optional repair), move to next scene.
export function advance(state: GameState): GameState {
  return { ...state, currentIndex: state.currentIndex + 1 }
}

// Apply repair points if offered and accepted
export function applyRepair(state: GameState): GameState {
  const i = state.currentIndex
  const h = state.history[i]
  if (!h?.outcome?.repair_available || !h?.outcome?.repair_action) return state
  const pts = Math.max(1, Math.min(3, h.outcome.repair_action.points_recovered))

  // Update history outcome points to reflect repair (non-destructive total score change)
  const updatedHistory = [...state.history]
  updatedHistory[i] = {
    ...h,
    outcome: { ...h.outcome, points: clampScore(h.outcome.points + pts) }
  }

  return {
    ...state,
    score: clampScore(state.score + pts),
    negativeStreak: 0, // repairs reset the streak
    history: updatedHistory,
  }
}

// Utility: number of scenes to play total today
export function totalScenes(plan: DayPlan): number {
  return plan.schedule.reduce((a, s) => a + s.count, 0)
}

// Return true if the day is over
export function isDayComplete(state: GameState): boolean {
  return state.currentIndex >= totalScenes(state.plan)
}
