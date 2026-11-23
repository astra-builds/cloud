import { useState } from "react";
import { GRAVE, SCENARIOS } from "../data";
import { MaskTitle, Reveal } from "./Reveal";
import { TraceLines, useRunner } from "./Trace";

export function Lab() {
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const [chaos, setChaos] = useState(true);
  const { lines, running, stats, run, cancel } = useRunner();
  const sc = SCENARIOS.find((s) => s.id === sid)!;

  return (
    <section id="lab" className="section wrap">
      <div className="sec-head">
        <div>
          <div className="sec-label mono" data-inspect>(03) The lab</div>
          <MaskTitle lines={["Poke", { em: "the agent" }]} />
        </div>
        <p className="sec-note" data-inspect>
          A tiny simulated agent. Pick a goal, sabotage a tool if you're feeling mean, and watch how it plans, fails, and recovers.
        </p>
      </div>

      <Reveal>
        <div className="play">
          <div className="play-ctl">
            <div className="mono play-lbl">1 — pick a goal</div>
            <div className="goals">
              {SCENARIOS.map((s) => (
                <button key={s.id} className={`goal ${s.id === sid ? "on" : ""}`} onClick={() => { setSid(s.id); cancel(); }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="mono play-lbl">2 — set the mood</div>
            <button className={`switch ${chaos ? "on" : ""}`} onClick={() => setChaos((c) => !c)} role="switch" aria-checked={chaos}>
              <span className="knob" />
              <span>Break a tool on purpose</span>
            </button>
            <button className="run" onClick={() => run(sc, chaos)} disabled={running}>
              {running ? "agent is thinking…" : lines.length ? "Run it again ↻" : "Run the agent ▸"}
            </button>
            <div className="meters mono">
              <div>
                <b>{(stats.ms / 1000).toFixed(1)}s</b>time
              </div>
              <div>
                <b>{stats.tokens.toLocaleString()}</b>tokens
              </div>
              <div>
                <b>${stats.cost.toFixed(3)}</b>cost
              </div>
            </div>
          </div>
          <div className="play-out">
            <div className="trace-head">
              <span>
                <i className={`dot-live ${running ? "" : "idle"}`} /> sandbox / {sc.id}
              </span>
              <span>{running ? "running" : lines.length ? "finished" : "idle"}</span>
            </div>
            <div className="trace-goal">
              <span style={{ opacity: 0.5 }}>goal</span> “{sc.goal}”
            </div>
            {lines.length === 0 && <div className="play-empty mono">▸ press run — nothing happens until you do.</div>}
            <TraceLines lines={lines} max={10} />
          </div>
        </div>
      </Reveal>

      <div className="grave-head">
        <div className="sec-label mono" data-inspect>Museum of failed agents</div>
        <p data-inspect>Everything I know about reliability, I learned from these. Flowers welcome.</p>
      </div>
      <div className="grave">
        {GRAVE.map((g, i) => (
          <Reveal key={g.name} delay={i * 100}>
            <div className="stone" data-inspect>
              <div className="stone-top mono">R.I.P.</div>
              <h4>{g.name}</h4>
              <div className="stone-years mono">
                {g.born} — {g.died}
              </div>
              <p>“{g.epitaph}”</p>
              <div className="stone-lesson">
                <span className="mono">lesson</span>
                {g.lesson}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
