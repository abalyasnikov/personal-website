"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  ["frame", "where user value is blocked"],
  ["inspect", "concrete failed journeys"],
  ["define", "“better” as an eval"],
  ["build", "the smallest end‑to‑end intervention"],
  ["measure", "behavior against baseline"],
  ["learn", "update the product thesis"],
  ["decide", "ship · scale · kill"],
] as const;

const command = "andrey run product_eval";
const typeMs = 28;
const typeDelayMs = 300;
const streamMs = 110;
const doneDelayMs = 400;

// The exported page carries the settled state, so the terminal reads complete
// without JavaScript. The inline script in the layout marks a pending run
// before first paint; this component performs it once per pageview: the
// command types out, the steps stream in, the run ends at `decide`, and the
// status dot starts its pulse. Nothing loops.
type Phase = "settled" | "typing" | "streaming" | "done";

export function EvalTerminal() {
  const [phase, setPhase] = useState<Phase>("settled");
  const [typedCount, setTypedCount] = useState(command.length);
  const [streamedCount, setStreamedCount] = useState(0);
  const [dotOn, setDotOn] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const local = timers.current;
    const later = (fn: () => void, ms: number) => {
      local.push(setTimeout(fn, ms));
    };
    const finish = () => {
      setPhase("done");
      setDotOn(true);
      document.documentElement.classList.remove("eval-replay");
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("eval-replay");
      later(finish, 0);
    } else {
      later(() => {
        setPhase("typing");
        setTypedCount(0);
      }, 0);
      for (let i = 1; i <= command.length; i += 1) {
        later(() => setTypedCount(i), typeDelayMs + i * typeMs);
      }
      const typeDone = typeDelayMs + command.length * typeMs + 150;
      later(() => setPhase("streaming"), typeDone);
      for (let i = 1; i <= steps.length; i += 1) {
        later(() => setStreamedCount(i), typeDone + i * streamMs);
      }
      later(finish, typeDone + steps.length * streamMs + doneDelayMs);
    }

    return () => {
      local.forEach(clearTimeout);
      local.length = 0;
    };
  }, []);

  const launching = phase === "typing" || phase === "streaming";

  return (
    <div
      className={`terminal${phase === "done" ? " is-live" : ""}${launching ? " is-launching" : ""}`}
      aria-label="Product evaluation workflow"
    >
      <div className="terminal-title">
        <span>andrey.run / product_eval</span>
        <span className={`terminal-status${dotOn ? " is-on" : ""}`} aria-hidden="true">
          <i />
        </span>
      </div>
      <div className="terminal-body">
        <div className="eval-prompt">
          <span>$&nbsp;</span>
          <span className="eval-typed">{command.slice(0, typedCount)}</span>
          {launching ? <span className="eval-cursor" aria-hidden="true" /> : null}
        </div>
        <dl className="eval-list">
          {steps.map(([label, description], index) => (
            <div
              className={`eval-row${label === "learn" ? " eval-loop" : ""}${index < streamedCount ? " is-in" : ""}`}
              key={label}
            >
              <dt>{label}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
