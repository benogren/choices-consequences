"use client";

import { useEffect, useMemo, useState } from "react";
import {
  initGameState,
  buildSceneRequestInput,
  applyChoice,
  advance,
  isDayComplete,
  totalScenes,
  timeOfDayForIndex,
  SCORE_MIN,
  SCORE_MAX,
  type GameState,
} from "./lib/game"; // update path
import { generateScene } from "./lib/api"; // update path
import FlipCard from "./components/FlipCard"; // update path
import { vt323 } from "./components/fonts";
import { Loader } from "lucide-react";
import Image from "next/image";

// Add "start" to the Phase type
type Phase = "start" | "boot" | "loading" | "choosing" | "revealed" | "summary";

// Define types for scene options and outcomes
interface SceneOption {
  id: string;
  text: string;
}

interface Outcome {
  title: string;
  description: string;
  points: number;
  learning_note: string;
  repair_available?: boolean;
  repair_action?: string;
}

/**
 * IMPORTANT HYDRATION FIX:
 * We avoid calling initGameState() during the server render. Client Components
 * still SSR in Next.js; randomization on the server (Math.random()) leads to
 * mismatched HTML. So we bootstrap state AFTER mount.
 */
export default function GamePage() {
  const [state, setState] = useState<GameState | null>(null);
  // Change initial phase to "start"
  const [phase, setPhase] = useState<Phase>("start");
  const [error, setError] = useState<string | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Add a function to start the game
  const handleStartGame = () => {
    const s = initGameState();
    setState(s);
    setIsCardFlipped(false);
    setPhase("loading");
  };

  // Derived values guarded by null checks - Fixed dependencies
  const total = useMemo(() => (state ? totalScenes(state.plan) : 0), [state]);
  const currentTimeOfDay = useMemo(
    () => (state ? timeOfDayForIndex(state.plan, state.currentIndex) : "Morning"),
    [state]
  );
  const currentScene = state ? state.scenes[state.currentIndex] : undefined;
  const currentHistory = state ? state.history[state.currentIndex] : undefined;
  const chosenId = selectedChoiceId || currentHistory?.choice_id || null;
  
  // Handle potential case mismatches between choice IDs and consequence keys
  const chosenOutcome = (() => {
    if (!chosenId || !currentScene?.consequences) return null;
    
    // Try exact match first
    if (currentScene.consequences[chosenId]) {
      return currentScene.consequences[chosenId];
    }
    
    // Try lowercase match
    const lowercaseId = chosenId.toLowerCase();
    if (currentScene.consequences[lowercaseId]) {
      return currentScene.consequences[lowercaseId];
    }
    
    // Try uppercase match
    const uppercaseId = chosenId.toUpperCase();
    if (currentScene.consequences[uppercaseId]) {
      return currentScene.consequences[uppercaseId];
    }
    
    console.warn('No consequence found for choice ID:', chosenId, 'Available keys:', Object.keys(currentScene.consequences));
    return null;
  })();

  // Generate the initial scene when game starts
  useEffect(() => {
    if (!state) return;
    // Only run on initial load or when starting a new game
    if (phase !== "loading" || state.currentIndex !== 0 || state.scenes.length > 0) return;
    
    let cancelled = false;

    async function loadInitialScene() {
      setError(null);
      try {
        const input = buildSceneRequestInput(state!);
        const scene = await generateScene(input);
        const tod = timeOfDayForIndex(state!.plan, 0);
        if (!cancelled) {
          setState((s) => {
            if (!s) return s;
            return {
              ...s,
              scenes: [{ ...scene, timeOfDay: tod }],
              history: s.history.map((h, i) =>
                i === 0 ? { ...h, timeOfDay: tod } : h
              ),
            };
          });
          setPhase("choosing");
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const errorMessage = e instanceof Error ? e.message : "Failed to generate scene.";
          setError(errorMessage);
          setPhase("choosing");
        }
      }
    }

    loadInitialScene();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]); // Only depend on phase

  const handleChoose = (choiceId: string) => {
    if (!state) {
      return;
    }
    // Prevent choosing again if already revealed
    if (phase === "revealed" || isCardFlipped) {
      return;
    }
    
    setSelectedChoiceId(choiceId);
    setState((s) => {
      if (!s) return s;
      return applyChoice(s, choiceId);
    });
    setPhase("revealed");
    setIsCardFlipped(true);
  };

  const handleNext = async () => {
    if (!state) return;
    
    // Update state and get the new state
    const newState = advance(state);
    
    // Clear selections
    setSelectedChoiceId(null);
    setIsCardFlipped(false);
    
    // Check if day is complete
    if (isDayComplete(newState)) {
      setState(newState);
      setPhase("summary");
      return;
    }
    
    // Check if scene already exists at new index
    if (newState.scenes[newState.currentIndex]) {
      setState(newState);
      setPhase("choosing");
      return;
    }
    
    // Load new scene
    setPhase("loading");
    setState(newState);
    
    try {
      const input = buildSceneRequestInput(newState);
      const scene = await generateScene(input);
      const tod = timeOfDayForIndex(newState.plan, newState.currentIndex);
      
      setState((s) => {
        if (!s || s.currentIndex !== newState.currentIndex) {
          return s;
        }
        return {
          ...s,
          scenes: [...s.scenes, { ...scene, timeOfDay: tod }],
          history: s.history.map((h, i) =>
            i === s.currentIndex ? { ...h, timeOfDay: tod } : h
          ),
        };
      });
      setPhase("choosing");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to generate scene.";
      setError(errorMessage);
      setPhase("choosing");
    }
  };

  const handleRestart = () => {
    const s = initGameState();
    setState(s);
    setSelectedChoiceId(null);
    setIsCardFlipped(false);
    setPhase("loading");
    setError(null);
  };

  const score = state?.score ?? 0;

  // Show start screen if in "start" phase
  if (phase === "start") {
    return (
      <main className="min-h-screen p-4 flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center space-y-8 bg-white border-darkcyan border-4 rounded-2xl p-8 md:p-12 shadow-lg max-w-2xl min-w-[550px]">
          <h1 className={`text-6xl md:text-7xl leading-15 text-jet-100 ${vt323.className}`}>
            A day in the life of a pixelated boy
          </h1>
          <p className="text-lg opacity-80 max-w-md mx-auto">
            Make decisions throughout your day and see how they impact your score!
          </p>
          <button
            onClick={handleStartGame}
            className={`text-2xl mt-4 rounded-xl text-white text-shadow bg-gradient-to-br from-darkcyan-500 to-brunswickgreen-500 px-8 py-4 hover:opacity-90 ${vt323.className}`}
          >
            Play Now
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8" suppressHydrationWarning>
      {/* Header */}
      <header className="max-w-3xl mx-auto mb-4 md:mb-6">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-white text-xl opacity-90 text-center ${vt323.className}`}>
            {state ? state.plan.dayType : "—"} • {currentTimeOfDay}
          </p>

          {/* Progress dots (render only after client bootstraps) */}
          <div className="flex flex-wrap gap-1">
            {state &&
              Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-2.5 h-2.5 rounded-full ${
                    i < state.currentIndex ? "bg-white/70" : "bg-white/30"
                  }`}
                  title={`Scene ${i + 1}`}
                />
              ))}
          </div>
        </div>
      </header>

      {/* Body with FlipCard */}
      <section className="mx-auto">
        {!state || phase === "boot" ? (
          <div className="py-16 text-center opacity-80">Starting a new day…</div>
        ) : phase === "summary" ? (
          <EndOfDay score={score} onRestart={handleRestart} dayType={state.plan.dayType} />
        ) : phase === "loading" ? (
          <div className="py-16 text-center bg-white border-darkcyan border-4 rounded-2xl p-8 md:p-12 shadow-lg min-w-[650px]">
            {/* <Loader className="mx-auto mb-4 animate-spin text-darkcyan" /> */}
            <img
              src="/pixels/loading.png"
              alt="Loading"
              width={30}
              height={30}
              className="mx-auto animate-spin"
            />
            <h1 className={`text-lg text-darkcyan animate-pulse ${vt323.className} mt-8`}>Loading your next scene...</h1>
          </div>
        ) : (
          <FlipCard
            flipped={isCardFlipped}
            onFlip={() => setIsCardFlipped(!isCardFlipped)}
            className="w-full"
            ariaLabel="Consequence card"
            front={
              <div className="">
                {!currentScene ? (
                  <div className="py-16 text-center opacity-80">No scene available.</div>
                ) : (
                  <>
                  <div className="relative h-64 overflow-hidden rounded-2xl">
                      <Image
                        src={state.plan.dayType === "School Day" && currentTimeOfDay === "Morning" ? "/pixels/boy-school-morning.png" 
                          : state.plan.dayType === "School Day" && currentTimeOfDay === "Day" ? "/pixels/boy-school.png"
                          : state.plan.dayType === "School Day" && currentTimeOfDay === "Afternoon/Night" ? "/pixels/boy-home.png"
                          : state.plan.dayType === "Weekend" && currentTimeOfDay === "Morning" ? "/pixels/boy-home-morning.png"
                          : state.plan.dayType === "Weekend" && currentTimeOfDay === "Day" ? "/pixels/boy-home-day.png"
                          : state.plan.dayType === "Weekend" && currentTimeOfDay === "Afternoon/Night" ? "/pixels/boy-home.png"
                          : "/pixels/boy-home.png"}
                        fill
                        alt="boy"
                        className="object-cover transition-transform"
                      />
                    </div>
                    <div className="mb-8 mt-4">
                      <h1 className={`text-3xl text-jet-100 text-center ${vt323.className}`}>
                        Scenario:
                      </h1>
                      <p className="text-sm md:text-base opacity-90 text-center">
                        {currentScene.scenario}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {currentScene.options.map((opt: SceneOption) => (
                        <button
                          key={opt.id}
                          onClick={() => handleChoose(opt.id)}
                          disabled={phase === "revealed" || isCardFlipped}
                          className={`rounded-2xl border-2 transition p-4 text-left cursor-pointer relative z-10 ${
                            phase === "revealed" && chosenId === opt.id
                              ? "bg-darkcyan/20 border-darkcyan"
                              : "bg-white border-darkcyan/30"
                          } ${
                            phase === "revealed" || isCardFlipped
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-50 hover:border-darkcyan/80 hover:shadow-md"
                          }`}
                          type="button"
                        >
                          <div className="text-xs text-darkcyan uppercase opacity-80">
                            {phase === "revealed" && chosenId === opt.id ? "Chosen" : "Choose"}
                          </div>
                          <div className={`mt-2 text-xl text-darkcyan leading-5 ${vt323.className}`}>{opt.text}</div>
                        </button>
                      ))}
                    </div>

                    {error && (
                      <div className="text-red-200 text-sm bg-red-900/30 rounded-lg p-3 mt-3">
                        {error}
                      </div>
                    )}
                  </>
                )}
              </div>
            }
            back={
              <div className="p-8">
                {!chosenOutcome && phase !== "revealed" ? (
                  <div className="py-12 text-center opacity-80">No outcome yet.</div>
                ) : chosenOutcome ? (
                  <>
                    <ConsequenceCard outcome={chosenOutcome as Outcome} dayType={state.plan.dayType} />
                    <div className="mt-4 flex items-center gap-3 mx-auto">
                      <button
                        onClick={handleNext}
                        className={`mx-auto text-lg mt-4 rounded-xl text-white text-shadow bg-gradient-to-br from-darkcyan-500 to-brunswickgreen-500 px-8 py-2 hover:opacity-90 ${vt323.className}`}
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-red-500">Error: No outcome found for this choice.</p>
                    <button
                      onClick={() => {
                        setIsCardFlipped(false);
                        setPhase("choosing");
                      }}
                      className={`mx-auto text-lg mt-4 rounded-xl text-white bg-gray-500 px-8 py-2 hover:opacity-90 ${vt323.className}`}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            }
          />
        )}
      </section>
    </main>
  );
}

function ConsequenceCard({ outcome, dayType }: { outcome: Outcome; dayType: string }) {
  return (
    <>
      <div className="relative h-64 overflow-hidden rounded-2xl">
        <Image
          src={
            outcome.points >= 0 && dayType === "School Day" ? "/pixels/boy-school-reward.png" 
            : outcome.points >= 0 && dayType === "Weekend" ? "/pixels/boy-home-reward.png"
            : outcome.points < 0 && dayType === "School Day" ? "/pixels/boy-school-consequence.png"
            : outcome.points < 0 && dayType === "Weekend" ? "/pixels/boy-home-consequence.png"
            : "/pixels/boy-consequence.png"}
          fill
          alt="boy"
          className="object-cover transition-transform"
        />
      </div>
      <h1 className={`text-3xl text-jet-100 text-center ${vt323.className} mb-2 mt-4`}>
        {outcome.points >= 0 ? "Reward" : "Consequence"}{" "}
        <span className={outcome.points >= 0 ? "text-green-300 font-bold" : "text-red-300 font-bold"}>
            {outcome.points >= 0 ? "+" : ""}
            {outcome.points}
          </span>
      </h1>
        <div className="text-lg font-bold text-center">{outcome.title}</div>
        <div className="opacity-90 text-center max-w-lg mx-auto">{outcome.description}</div>
        <div className="mt-1 text-xs opacity-80 text-center">{outcome.learning_note}</div>
      </>
  );
}

function EndOfDay({
  score,
  onRestart,
  dayType,
}: {
  score: number;
  onRestart: () => void;
  dayType: string;
}) {
  // Compute scorePct locally
  const scorePct = ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;

  const verdict =
    score >= 12
      ? `Great ${dayType}! You handled challenges with care.`
      : score >= 4
      ? `Nice ${dayType}! Most choices moved things forward.`
      : score >= -3
      ? `Mixed ${dayType}. Tomorrow is a fresh start.`
      : `Tough ${dayType}. One good choice can turn things around tomorrow.`;
  
  const finalimage =
    score >= 12
      ? "/pixels/boy-end-happy.png"
      : score >= 4
      ? "/pixels/boy-end-happy.png"
      : score >= -3
      ? "/pixels/boy-end-mixed.png"
      : "/pixels/boy-end-sad.png";

  return (
    <>
    <main>
          <div className="text-center bg-white border-darkcyan border-4 rounded-2xl p-8 md:p-12 shadow-lg min-w-[650px]">
              <div className="relative h-64 overflow-hidden rounded-2xl">
            <Image
              src={finalimage}
              fill
              alt="boy"
              className="object-cover transition-transform"
            />
          </div>
          <h2 className={`text-6xl text-jet-100 ${vt323.className} mt-4`}>End of Day</h2>

          <div className={`text-4xl ${vt323.className} mb-8`}>
            Final Score:{" "}
            <span className={score >= 0 ? "text-green-300" : "text-red-500"}>{score}</span>
          </div>

          <p className="text-lg opacity-80 max-w-md mx-auto mb-8">{verdict}</p>
          
          <button
            onClick={onRestart}
            className={`text-2xl mt-2 rounded-xl text-white text-shadow bg-gradient-to-br from-darkcyan-500 to-brunswickgreen-500 px-4 py-2 hover:opacity-90 ${vt323.className}`}
          >
            Play Again
          </button>
        </div>
    </main>
    </>
  );
}