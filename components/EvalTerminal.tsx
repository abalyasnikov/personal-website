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
const stepMs = 2000;
const typeMs = 28;
const typeDelayMs = 300;
const streamMs = 110;
const badgeDelayMs = 350;
const traceDelayMs = 800;
const sessionKey = "eval-ran";

// The exported page carries the settled state, so the terminal reads complete
// without JavaScript. The inline script in the layout marks a pending replay
// before first paint; this component then performs it once per session and
// hands off to the continuous trace.
type Phase = "settled" | "typing" | "streaming" | "running";

export function EvalTerminal() {
  const [phase, setPhase] = useState<Phase>("settled");
  const [typedCount, setTypedCount] = useState(command.length);
  const [streamedCount, setStreamedCount] = useState(0);
  const [badgeOn, setBadgeOn] = useState(false);
  const [current, setCurrent] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const local = timers.current;
    let interval: ReturnType<typeof setInterval> | undefined;
    const later = (fn: () => void, ms: number) => {
      local.push(setTimeout(fn, ms));
    };
    const startTrace = () => {
      setPhase("running");
      setBadgeOn(true);
      document.documentElement.classList.remove("eval-replay");
      interval = setInterval(() => setCurrent((value) => value + 1), stepMs);
    };

    let ran = false;
    try {
      ran = sessionStorage.getItem(sessionKey) === "1";
    } catch {
      ran = true;
    }

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Static frame: first step marked, no replay, no advancing loop.
      document.documentElement.classList.remove("eval-replay");
      later(() => {
        setPhase("running");
        setBadgeOn(true);
      }, 0);
    } else if (ran) {
      later(startTrace, 0);
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
      for (let i = 1; i <= steps.length + 1; i += 1) {
        later(() => setStreamedCount(i), typeDone + i * streamMs);
      }
      const streamDone = typeDone + (steps.length + 1) * streamMs;
      later(() => setBadgeOn(true), streamDone + badgeDelayMs);
      later(() => {
        try {
          sessionStorage.setItem(sessionKey, "1");
        } catch {
          /* the replay simply runs again next visit */
        }
        startTrace();
      }, streamDone + traceDelayMs);
    }

    return () => {
      local.forEach(clearTimeout);
      local.length = 0;
      if (interval) clearInterval(interval);
    };
  }, []);

  const running = phase === "running";
  const launching = phase === "typing" || phase === "streaming";
  const activeStep = running ? current % steps.length : -1;

  return (
    <div
      className={`terminal${running ? " is-live" : ""}${launching ? " is-launching" : ""}`}
      aria-label="Product evaluation workflow"
    >
      <div className="terminal-title">
        <span>andrey.run / product_eval</span>
        <strong className={badgeOn ? "is-on" : undefined}>
          <i aria-hidden="true" />
          active
        </strong>
      </div>
      <div className="terminal-body">
        <div className="eval-prompt">
          <span>$&nbsp;</span>
          <span className="eval-typed">{command.slice(0, typedCount)}</span>
          {launching ? <span className="eval-cursor" aria-hidden="true" /> : null}
        </div>
        <dl className="eval-list">
          {steps.map(([label, description], index) => {
            const isCurrent = index === activeStep;
            const isDone = running && index < activeStep;
            const rowClass = [
              "eval-row",
              label === "learn" ? "eval-loop" : "",
              index < streamedCount ? "is-in" : "",
              isCurrent ? "is-current" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div className={rowClass} key={label} aria-current={isCurrent ? "step" : undefined}>
                <dt>
                  <span className="eval-glyph" aria-hidden="true">
                    {isDone ? "✓ " : "  "}
                  </span>
                  {label}
                </dt>
                <dd>
                  {description}
                  {isCurrent ? <span className="eval-cursor" aria-hidden="true" /> : null}
                </dd>
              </div>
            );
          })}
          <div className={`eval-row eval-loop-row${streamedCount > steps.length ? " is-in" : ""}`}>
            <dt>
              <span className="eval-glyph" aria-hidden="true">
                {"  "}
              </span>
              ↺
            </dt>
            <dd>back to frame</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
