// app/api/generate-scene/route.ts
import { NextResponse } from "next/server";

type TimeOfDay = "Morning" | "Day" | "Afternoon/Night";
type DayType = "School Day" | "Weekend";

type Input = {
  dayType: DayType;
  timeOfDay: TimeOfDay;
  previous?: {
    scenario: string;
    choice_text: string;
    consequence_text: string;
    points_delta: number;
  } | null;
  negative_streak: number;
  total_score: number;
  must_offer_repair: boolean;
};

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as Input;

    const system = [
      "You are a kid‑friendly game master for ages 9–12.",
      "Write short, concrete dilemmas that fit the time of day and day type.",
      "Tone is kind and supportive. Avoid sensitive topics (injuries, weapons, slurs, romance, medical issues, death).",
      "Keep strings concise: scenario ≤ 28 words; each choice ≤ 22 words; descriptions ≤ 28 words.",
      "Points must be integers between −5 and +5.",
      
      // NEW: Instructions for using previous scenario context
      "IMPORTANT: If a previous scenario is provided:",
      "- DO NOT repeat the same scenario or very similar situations",
      "- Consider natural progression from the previous choice's consequence",
      "- Build continuity where appropriate (e.g., if they helped someone earlier, that person might appear grateful later)",
      "- Vary the types of dilemmas (if previous was about sharing, next could be about responsibility, honesty, etc.)",
      "- Keep track of relationships and consequences that might carry forward",
      
      "If must_offer_repair is true, ensure at least one negative outcome includes a simple repair_action worth 1..3 points.",
      "If negative_streak ≥ 2, de‑escalate by offering a clear \"make it right\" path.",
      "Output ONLY valid JSON that matches the schema. No extra prose.",
      
      // Time and day-specific scenarios (existing)
      "If the dayType is a Weekend, make the dilemma related more to family interactions and responsibilities.",
      "If the dayType is a School Day, focus on social dynamics, peer relationships, and academic pressures.",
      "If the dayType is a School Day and timeOfDay is Morning, focus on responsibilities and tasks for the morning like getting ready for school, eating breakfast, and packing your bag.",
      "If the dayType is a School Day and timeOfDay is Day, focus on responsibilities and tasks for the day, such as attending classes, completing assignments, and socializing with friends.",
      "If the dayType is a School Day and timeOfDay is Afternoon/Night, focus on responsibilities and tasks for after school, such as sports practice, finishing homework, getting ready for bed, and family time.",
      "If the dayType is a Weekend and timeOfDay is Morning, focus on family activities like sleeping in, having a leisurely breakfast, and spending time with siblings.",
      "If the dayType is a Weekend and timeOfDay is Day, focus on fun activities and outings such as playing with friends, going to the park, sporting events, or visiting family.",
      "If the dayType is a Weekend and timeOfDay is Afternoon/Night, focus on activities like sleepovers, hanging out with friends, doing chores, having family dinner, and getting ready for bed.",
      "Themes to explore include friendship, family dynamics, personal responsibility, peer pressure, and the balance between fun and obligations.",
      
      // NEW: Variety guidelines
      "Ensure variety in scenarios by rotating through different themes and situations.",
      "Track which characters (friend, sibling, parent, teacher) have appeared to avoid overuse."
    ].join("\n");

    const user = JSON.stringify({
      instruction:
        "Generate one scene with exactly two choices and one consequence per choice.",
      constraints: {
        timeOfDay: input.timeOfDay,
        dayType: input.dayType,
        previous: input.previous ?? null,
        negative_streak: input.negative_streak,
        total_score: input.total_score,
        must_offer_repair: input.must_offer_repair,
      },
      schema:
        "Scene { id, timeOfDay, scenario, options[2 x {id,text}], consequences: { [choiceId]: { title, description, points(-5..5), polarity('positive'|'negative'|'neutral'), repair_available?, repair_action?{text,points_recovered(1..3)}, learning_note } } }",
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Mock fallback for local dev (no key)
      return NextResponse.json({
        id: "mock-1",
        timeOfDay: input.timeOfDay,
        scenario:
          input.timeOfDay === "Morning"
            ? "Your little brother borrowed your pencil and didn’t return it before school."
            : "Your friend wants to skip cleanup after a board game at their house.",
        options: [
          { id: "A", text: "Ask kindly for it back and offer a spare." },
          { id: "B", text: "Complain loudly that they always lose your stuff." },
        ],
        consequences: {
          A: {
            title: "That worked",
            description:
              "They hand it back and thank you for the spare. You both get to class on time.",
            points: 2,
            polarity: "positive",
            learning_note: "Polite, specific asks work better than blame.",
          },
          B: {
            title: "Tension rises",
            description:
              "Voices rise, you’re both late, and no one feels good.",
            points: -2,
            polarity: "negative",
            repair_available: true,
            repair_action: {
              text: "Take a breath, apologize for shouting, and try again calmly.",
              points_recovered: 2,
            },
            learning_note: "Calm words help people fix small problems faster.",
          },
        },
      });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "OpenAI error", status: res.status, text },
        { status: 500 }
      );
    }

    const data = await res.json();
    const content: string =
      data?.choices?.[0]?.message?.content ?? "{}";

    // Defensive parse (strip accidental code fences)
    const jsonText = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonText);

    // Final sanitization: clamp points and ensure polarity
    for (const id of Object.keys(parsed.consequences ?? {})) {
      const c = parsed.consequences[id];
      const p = Math.max(-5, Math.min(5, Number(c.points ?? 0)));
      c.points = p;
      if (!c.polarity) c.polarity = p > 0 ? "positive" : p < 0 ? "negative" : "neutral";
    }

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", detail: err || String(err) },
      { status: 500 }
    );
  }
}