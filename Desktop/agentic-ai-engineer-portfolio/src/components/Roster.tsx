import { ROSTER } from "../data";
import { MaskTitle, Reveal } from "./Reveal";

export function Roster() {
  return (
    <section id="agents" className="section wrap roster-sec">
      <div className="sec-head">
        <div>
          <div className="sec-label mono" data-inspect>(02) Capabilities</div>
          <MaskTitle lines={["The", { em: "roster" }]} />
        </div>
        <p className="sec-note" data-inspect>
          The practical toolkit behind my projects: agent orchestration, LLM applications, automation, evaluation, and data storytelling.
        </p>
      </div>
      <div className="roster">
        {ROSTER.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 90} className="rwrap">
            <div className="rcard" style={{ ["--c" as string]: r.color, ["--ci" as string]: r.ink }} data-inspect>
              <div className="rtag">
                <svg width="24" height="28" viewBox="0 0 22 26" fill="none">
                  <path d="M3 2.5v17.2l4.6-4.2 3.2 7.4 3.1-1.4-3.2-7.2h6.3L3 2.5Z" fill={r.color} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                <span style={{ background: r.color, color: r.ink }}>{r.name}</span>
              </div>
              <div className="rnum mono">0{i + 1}</div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <div className="chips">
                {r.chips.map((c) => (
                  <span key={c} className="chip mono">
                    {c}
                  </span>
                ))}
              </div>
              <div className="rstat mono">{r.stat}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
