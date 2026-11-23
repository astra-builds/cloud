import { COMMITS } from "../data";
import { MaskTitle, Reveal } from "./Reveal";

function Graph({ lane, first, last }: { lane: number; first: boolean; last: boolean }) {
  if (lane === 1) {
    return (
      <div className="graph">
        <i className="gline" style={{ top: 0, bottom: 0 }} />
        <svg className="gbranch" viewBox="0 0 80 100" preserveAspectRatio="none">
          <path d="M18 0 C18 28, 52 22, 52 50 C52 78, 18 72, 18 100" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        <i className="gdot side" style={{ left: 52, top: "50%" }} />
      </div>
    );
  }
  return (
    <div className="graph">
      <i className="gline" style={{ top: first ? 30 : 0, bottom: last ? "auto" : 0, height: last ? 30 : undefined }} />
      <i className={`gdot ${first ? "head" : ""}`} style={{ left: 18, top: 30 }} />
    </div>
  );
}

export function Path() {
  return (
    <section id="path" className="section wrap">
      <div className="sec-head">
        <div>
          <div className="sec-label mono" data-inspect>(04) Career, as a git log</div>
          <MaskTitle lines={["git", { em: "log --graph" }]} />
        </div>
        <p className="sec-note" data-inspect>
          A compact record of the roles, research, internships, and education shaping my work.
        </p>
      </div>
      <div className="commits">
        {COMMITS.map((c, i) => (
          <Reveal key={c.hash} delay={60}>
            <div className={`commit ${c.lane === 1 ? "side" : ""}`}>
              <Graph lane={c.lane} first={i === 0} last={i === COMMITS.length - 1} />
              <div className="commit-body" data-inspect>
                <div className="commit-top mono">
                  <span className="hash">{c.hash}</span>
                  {c.ref && <span className="ref">{c.ref}</span>}
                  <span className="when">{c.when}</span>
                </div>
                <h3>{c.msg}</h3>
                <div className="where">@ {c.where}</div>
                <ul>
                  {c.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
