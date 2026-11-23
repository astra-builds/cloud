import { PROJECTS } from "../data";
import { ProjectArt } from "./ProjectArt";
import { MaskTitle, Reveal } from "./Reveal";

export function Work({ open, setOpen }: { open: number; setOpen: (i: number) => void }) {
  return (
    <section id="work" className="section wrap">
      <div className="sec-head">
        <div>
          <div className="sec-label mono" data-inspect>(01) Selected work</div>
          <MaskTitle lines={["Case", { em: "files" }]} />
        </div>
        <p className="sec-note" data-inspect>
          A selected set of AI, automation, and data projects. Tap a row — each one opens like a drawer.
        </p>
      </div>
      <div className="projs">
        {PROJECTS.map((p, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={p.id} delay={i * 60}>
              <article className={`proj ${isOpen ? "open" : ""}`} style={{ ["--pc" as string]: p.color }}>
                <button className="proj-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span className="mono proj-n">0{i + 1}</span>
                  <span className="proj-name">{p.name}</span>
                  <span className="proj-meta mono">
                    <span>{p.kind}</span>
                    <span>{p.year}</span>
                  </span>
                  <span className="proj-plus" aria-hidden>
                    <i />
                    <i />
                  </span>
                </button>
                <div className="proj-body">
                  <div className="proj-inner">
                    <div className="proj-content">
                      <div className="proj-copy">
                        <p data-inspect>{p.long}</p>
                        <div className="proj-metric">
                          <b>{p.metric}</b>
                          <span className="mono">{p.metricLabel}</span>
                        </div>
                        <div className="chips">
                          {p.stack.map((s) => (
                            <span key={s} className="chip mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="proj-art" data-inspect>
                        <ProjectArt p={p} />
                        <span className="proj-art-tag mono">fig.{i + 1} — {p.name.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
