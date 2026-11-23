import { useCallback, useEffect, useRef, useState } from "react";
import { Engine, type AgentDef } from "./agents/engine";
import { PLAN } from "./agents/plan";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { Roster } from "./components/Roster";
import { Lab } from "./components/Lab";
import { Path } from "./components/Path";
import { Manifesto } from "./components/Manifesto";
import { Contact } from "./components/Contact";

type LogLine = { id: number; agent: AgentDef; text: string };

export default function App() {
  const [agentsOn, setAgentsOn] = useState(true);
  const [open, setOpen] = useState(0);
  const [phase, setPhase] = useState<"intro" | "done" | "gone">("intro");
  const [log, setLog] = useState<LogLine[]>([]);
  const [prog, setProg] = useState({ done: 0, total: 1 });
  const [built, setBuilt] = useState("Built with curiosity and coffee");
  const engine = useRef<Engine | null>(null);
  const lid = useRef(0);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("intro");
    window.scrollTo(0, 0);
    let cancelled = false;
    let eng: Engine | null = null;
    let fail = 0;

    (async () => {
      await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1600))]);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (cancelled) return;
      eng = new Engine({
        onLog: (agent, text) => setLog((l) => [...l.slice(-3), { id: ++lid.current, agent, text }]),
        onProgress: (done, total) => setProg({ done, total }),
        onDone: (ms) => {
          html.classList.remove("intro");
          setBuilt(`Portfolio assembled in ${(ms / 1000).toFixed(1)}s`);
          setPhase("done");
          setTimeout(() => setPhase("gone"), 3200);
        },
      });
      engine.current = eng;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) eng.skip();
      fail = window.setTimeout(() => eng?.skip(), 16000);
      eng.run(PLAN);
    })();

    return () => {
      cancelled = true;
      clearTimeout(fail);
      eng?.destroy();
      html.classList.remove("intro");
    };
  }, []);

  const toggle = useCallback(() => {
    setAgentsOn((v) => {
      engine.current?.setAmbient(!v);
      return !v;
    });
  }, []);

  const openProject = useCallback((i: number) => setOpen(i), []);
  const pct = Math.min(100, Math.round((prog.done / prog.total) * 100));

  return (
    <div className="app" id="app">
      <div className="grain" aria-hidden />
      <Nav agentsOn={agentsOn} onToggle={toggle} />
      <main>
        <Hero onOpenProject={openProject} />
        <Work open={open} setOpen={setOpen} />
        <Roster />
        <Lab />
        <Path />
        <Manifesto />
      </main>
      <Contact onGather={(el) => engine.current?.gather(el)} built={built} />

      {phase !== "gone" && (
        <div className={`statusbar ${phase === "done" ? "done" : ""}`}>
          <div className="sb-prog" style={{ width: `${phase === "done" ? 100 : pct}%` }} />
          <div className="sb-state mono">
            {phase === "intro" ? (
              <>
                <i className="dot-live" /> assembling {pct}%
              </>
            ) : (
              <>✓ {built.toLowerCase()}</>
            )}
          </div>
          <div className="sb-log mono">
            {phase === "intro" &&
              log.map((l, i) => (
                <span key={l.id} style={{ opacity: 0.35 + (i / Math.max(1, log.length - 1)) * 0.65 }}>
                  <i style={{ background: l.agent.color }} />
                  {l.agent.name} <em>{l.text}</em>
                </span>
              ))}
          </div>
          {phase === "intro" && (
            <button className="sb-skip mono" onClick={() => engine.current?.skip()}>
              skip ⏭
            </button>
          )}
        </div>
      )}
    </div>
  );
}
