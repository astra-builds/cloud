import { useEffect, useRef } from "react";
import { PRINCIPLES } from "../data";
import { Reveal } from "./Reveal";

const TEXT =
  "An agent is not a prompt in a loop. It is a small organisation — with a planner, a budget, a memory, a conscience and an exit condition. I design the organisation first. Then I tune the people.";

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".fw"));
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.25)));
      const n = p * words.length * 1.15;
      words.forEach((w, i) => {
        const k = Math.min(1, Math.max(0, n - i));
        w.style.opacity = String(0.14 + k * 0.86);
        w.style.setProperty("--k", String(k));
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const words = TEXT.split(" ");
  return (
    <section id="philosophy" className="manifesto">
      <div className="wrap">
        <div className="sec-label mono" data-inspect>(05) Philosophy</div>
        <p className="manifesto-text" ref={ref} data-inspect>
          {words.map((w, i) => (
            <span key={i} className={`fw ${["organisation", "tune", "people.", "agent"].includes(w) ? "hl" : ""}`}>
              {w}{" "}
            </span>
          ))}
        </p>
        <div className="principles">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
              <div className="principle" data-inspect>
                <span className="pn">{p.n}</span>
                <h4>{p.t}</h4>
                <p>{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
