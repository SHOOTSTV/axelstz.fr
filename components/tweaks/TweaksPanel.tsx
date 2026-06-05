"use client";
import { useMode } from "@/components/ModeProvider";

const ACCENTS = ["#66c0f4", "#1fd6a0", "#91c257", "#a06bff", "#e0894a"];

export function TweaksPanel() {
  const { tweaks, setTweak } = useMode();
  return (
    <div className="tweaks-panel" aria-label="Theme tweaks">
      <h5>Profile color</h5>
      <div className="tweak-swatches">
        {ACCENTS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Accent ${c}`}
            className={`tweak-swatch ${tweaks.accent === c ? "active" : ""}`}
            style={{ background: c }}
            onClick={() => setTweak("accent", c)}
          />
        ))}
      </div>
      <label className="tweak-row">
        <input
          type="checkbox"
          checked={tweaks.starfield}
          onChange={(e) => setTweak("starfield", e.target.checked)}
        />
        Star-trail background
      </label>
    </div>
  );
}
