import { useCallback, useEffect, useRef, useState } from "react";
import type { Scenario, Step } from "../data";

const GLYPH: Record<Step["k"], string> = { plan: "◇", tool: "▸", think: "…", err: "", retry: "", ok: "✓" };

export type Line = { id: number; step: Step };

export function TraceLines({ lines, max = 7 }: { lines: Line[]; max?: number }) {
  const shown = lines.slice(-max);
  return (
    <div className="trace-lines">
      {shown.map((l) => (
        <div key={l.id} className={`tl tl-${l.step.k}`}>
          <span className="tl-g">{GLYPH[l.step.k]}</span>
          <span>{l.step.t}</span>
        </div>
      ))}
    </div>
  );
}

/** Runs a scenario step by step; resolves when done. Cancelable via the returned token ref. */
export function useRunner() {
  const [lines, setLines] = useState<Line[]>([]);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState({ ms: 0, cost: 0, tokens: 0 });
  const token = useRef(0);
  const uid = useRef(0);

  const run = useCallback(async (sc: Scenario, chaos: boolean) => {
    const my = ++token.current;
    setLines([]);
    setStats({ ms: 0, cost: 0, tokens: 0 });
    setRunning(true);
    const steps = [...sc.steps];
    if (chaos) steps.splice(2, 0, ...sc.fail);
    steps.push({ k: "ok", t: sc.summary, ms: 400 });
    let ms = 0,
      tokens = 0;
    for (const s of steps) {
      await new Promise((r) => setTimeout(r, s.ms));
      if (token.current !== my) return;
      ms += s.ms * 4.7;
      tokens += s.k === "think" || s.k === "plan" ? 640 : s.k === "tool" ? 210 : 90;
      setLines((p) => [...p, { id: ++uid.current, step: s }]);
      setStats({ ms, tokens, cost: tokens * 0.0000034 });
    }
    setRunning(false);
  }, []);

  const cancel = useCallback(() => {
    token.current++;
    setRunning(false);
  }, []);

  return { lines, running, stats, run, cancel, setLines };
}

/** The always-on little trace in the hero. */
export function HeroTrace({ scenarios }: { scenarios: Scenario[] }) {
  const { lines, run, stats } = useRunner();
  const idx = useRef(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      while (alive) {
        const sc = scenarios[idx.current % scenarios.length];
        await run(sc, idx.current % 2 === 0);
        await new Promise((r) => setTimeout(r, 2600));
        idx.current++;
      }
    })();
    return () => {
      alive = false;
    };
  }, [run, scenarios]);

  const sc = scenarios[idx.current % scenarios.length];
  return (
    <>
      <div className="trace-head">
        <span>
          <i className="dot-live" /> agent.trace
        </span>
        <span>
          {(stats.ms / 1000).toFixed(1)}s · ${stats.cost.toFixed(3)}
        </span>
      </div>
      <div className="trace-goal">
        <span style={{ opacity: 0.5 }}>goal</span> “{sc.goal}”
      </div>
      <TraceLines lines={lines} max={5} />
    </>
  );
}
