"use client";

import React, { ReactNode, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";

type FlipCardProps = {
  /** Content shown before the flip */
  front: ReactNode;
  /** Content revealed after the flip */
  back: ReactNode;
  /** Controlled: whether the card is flipped */
  flipped: boolean;
  /** Called when user taps/clicks/presses space/enter on the card */
  onFlip?: () => void;
  /** Disable interaction */
  disabled?: boolean;
  /** Optional extra classes for the outer wrapper */
  className?: string;
  /** Rounded corners size (tailwind radius token), defaults to 2xl */
  radiusClassName?: string;
  /** Shadow class name, defaults to shadow-xl */
  shadowClassName?: string;
  /** aria-label for accessibility when the card itself is the button */
  ariaLabel?: string;
};

/**
 * Accessible, sound‑free 3D flip card.
 * - Uses CSS 3D transforms (preserve-3d) for a smooth flip.
 * - Keyboard accessible (Enter/Space).
 * - Works with controlled state via `flipped` prop.
 *
 * Example:
 *  <FlipCard
 *    front={<div>Tap to reveal</div>}
 *    back={<Consequence title="..." />}
 *    flipped={isRevealed}
 *    onFlip={() => setIsRevealed(!isRevealed)}
 *  />
 */
export default function FlipCard({
  front,
  back,
  flipped,
  onFlip,
  disabled,
  className,
  radiusClassName = "rounded-2xl",
  shadowClassName = "shadow-xl",
  ariaLabel = "Flip card",
}: FlipCardProps) {
  const handleActivate = useCallback(() => {
    if (!disabled && onFlip) onFlip();
  }, [disabled, onFlip]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlip?.();
    }
  };

  return (
    <div
      className={clsx(
        "relative",
        "select-none",
        "perspective",
        className
      )}
      aria-live="polite"
    >
      {/* Clickable surface */}
      <div
        role={onFlip ? "button" : undefined}
        aria-label={ariaLabel}
        tabIndex={onFlip ? 0 : -1}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled || undefined}
        className={clsx(
          "group",
          "relative h-full w-full",
          "transition-transform duration-500",
          "preserve-3d",
          flipped ? "rotate-y-180" : "rotate-y-0",
          disabled ? "cursor-default" : "cursor-pointer"
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <div
          className={clsx(
            "max-w-2xl",
            radiusClassName,
            shadowClassName,
            "bg-white border-darkcyan border-4 rounded-2xl p-8 md:p-12 shadow-lg max-w-2xl",
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          className={clsx(
            "absolute inset-0",
            radiusClassName,
            shadowClassName,
            "bg-white border-darkcyan border-4 rounded-2xl shadow-lg max-w-2xl",
            "backface-hidden",
            "rotate-y-180"
          )}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

/* --- Helpers: minimal CSS fallbacks if not using globals --- */
/* If your globals.css already defines .perspective / .preserve-3d / .backface-hidden,
   you can remove these. Included for safety. */
declare global {
  // eslint-disable-next-line no-var
  var __flipcard_css_injected__: boolean | undefined;
}

// Runtime inject a tiny style tag once (keeps component portable)
if (typeof window !== "undefined" && !globalThis.__flipcard_css_injected__) {
  const style = document.createElement("style");
  style.innerHTML = `
    .perspective { perspective: 1000px; }
    .preserve-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }
    .rotate-y-0 { transform: rotateY(0deg); }
  `;
  document.head.appendChild(style);
  globalThis.__flipcard_css_injected__ = true;
}
