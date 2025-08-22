// Client-side API wrapper for per-scene generation & fetching decks.

// Define and export the Deck type
export interface Deck {
  id: string;
  name: string;
  description?: string;
  // Add other properties that your deck object contains
  // For example:
  // category?: string;
  // difficulty?: string;
  // tags?: string[];
}

export async function fetchDecks() {
  const res = await fetch('/api/get-decks')
  if (!res.ok) throw new Error('get-decks failed')
  return res.json() as Promise<{ decks: Deck[] }>
}

// Define and export types for the API inputs and outputs
export interface PreviousSceneContext {
  scenario: string;
  choice_text: string;
  consequence_text: string;
  points_delta: number;
}

export interface GenerateSceneInput {
  dayType: 'School Day' | 'Weekend';
  timeOfDay: 'Morning' | 'Day' | 'Afternoon/Night';
  previous?: PreviousSceneContext;
  negative_streak: number;
  total_score: number;
  must_offer_repair: boolean;
}

export interface SceneOption {
  id: string;
  text: string;
}

export interface Consequence {
  title: string;
  description: string;
  points: number;
  polarity: 'positive' | 'negative' | 'neutral';
  repair_available?: boolean;
  repair_action?: {
    text: string;
    points_recovered: number;
  };
  learning_note: string;
}

export interface GenerateSceneResponse {
  id: string;
  timeOfDay: 'Morning' | 'Day' | 'Afternoon/Night';
  scenario: string;
  options: SceneOption[];
  consequences: Record<string, Consequence>;
}

// Ask the server to generate one scene given context from game state.
export async function generateScene(input: GenerateSceneInput): Promise<GenerateSceneResponse> {
  const res = await fetch('/api/generate-scene', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('generateScene error:', text)
    throw new Error('generate-scene failed', { cause: { status: res.status, statusText: res.statusText, body: text } })
  }
  return res.json() as Promise<GenerateSceneResponse>
}