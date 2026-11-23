import { Letters } from "./Letters";
import { Orb } from "./Orb";
import { HeroTrace } from "./Trace";
import { ProjectArt } from "./ProjectArt";
import { HERO_LOOP, PROJECTS, STACK } from "../data";
import { useClock } from "../hooks";

export function Hero({ onOpenProject }: { onOpenProject: (i: number) => void }) {
  const time = useClock("Asia/Dhaka");
  const loop = [...STACK, ...STACK];
  return (
    <section className="hero wrap" id="top">
      <div className="hero-meta">
        <span className="mono" data-build="meta-label" data-inspect>
          Agentic AI Engineer / LLM Applications & Automation
        </span>
        <span className="pill mono" data-build="meta-pill">
          <i className="dot-live" /> Dhaka, Bangladesh
        </span>
        <span className="mono clock" data-build="clock">
          Dhaka {time || "--:--:--"} <b>UTC+6</b>
        </span>
      </div>

      <h1 className="hero-title" aria-label="Kamrul Hasan Ujjal">
        <span className="line">
          <span className="w" data-build="t-kamrul" data-chars="6" data-inspect>
            <Letters text="KAMRUL" />
          </span>
          <span className="orb-pill" data-build="orb" data-inspect>
            <Orb />
            <span className="orb-tag mono">LLMs · workflows</span>
          </span>
        </span>
        <span className="line">
          <span className="w serif" data-build="t-hasan" data-chars="5" data-inspect>
            <Letters text="Hasan" />
          </span>
          <span className="w" data-build="t-ujjal" data-chars="5" data-inspect>
            <Letters text="UJJAL" />
          </span>
          <span className="sticker mono" data-build="sticker" data-fx="sticker">
            <b>★</b> builds agents that plan, act &amp; recover
          </span>
        </span>
      </h1>

      <div className="hero-grid">
        <div className="hero-left">
          <p className="blurb" data-build="blurb" data-inspect>
            I build <em>LLM applications and intelligent automation</em> with Python, LangGraph, LangChain, CrewAI, and n8n — curious systems designed to make useful work easier.
          </p>
          <div className="cta-row" data-build="cta">
            <a href="#work" className="btn btn-solid">
              See the work <span>↓</span>
            </a>
            <a href="#lab" className="btn btn-ghost">
              Break an agent <span>✺</span>
            </a>
          </div>
          <div className="stats" data-build="stats" data-inspect>
            <div>
              <b>Python</b>
              <span>primary language</span>
            </div>
            <div>
              <b>LLM apps</b>
              <span>agentic systems &amp; automation</span>
            </div>
            <div>
              <b>AI evals</b>
              <span>research and developer tooling</span>
            </div>
          </div>
        </div>
        <div className="trace" data-build="trace" data-inspect>
          <HeroTrace scenarios={HERO_LOOP} />
        </div>
      </div>

      <div className="cards">
        {PROJECTS.slice(0, 4).map((p, i) => (
          <a key={p.id} href="#work" className="pcard" data-build={`card-${i}`} data-fx="none" onClick={() => onOpenProject(i)} style={{ ["--pc" as string]: p.color }}>
            <div className="pcard-art">
              <ProjectArt p={p} />
            </div>
            <div className="pcard-txt">
              <span className="mono">
                0{i + 1} / {p.kind}
              </span>
              <b>{p.name}</b>
              <em>{p.blurb}</em>
            </div>
            <span className="pcard-arrow">↗</span>
          </a>
        ))}
      </div>

      <div className="marquee" data-build="marquee">
        <div className="marquee-track">
          {loop.map((s, i) => (
            <span key={i}>
              {s} <i>✦</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
