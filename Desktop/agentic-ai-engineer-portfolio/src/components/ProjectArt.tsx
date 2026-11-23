import type { Project } from "../data";
import { useInView } from "../hooks";

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ProjectArt({ p, className = "" }: { p: Project; className?: string }) {
  const [ref, visible] = useInView<SVGSVGElement>(0.01);
  const { bg, fg, art } = p;
  const r = rng(p.name.length * 977 + 13);
  let body: React.ReactNode = null;

  if (art === "rings") {
    body = (
      <g className="spin-slow" style={{ transformOrigin: "100px 100px" }}>
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx="100" cy="100" r={10 + i * 11} fill="none" stroke={fg} strokeWidth={i % 3 === 0 ? 5 : 1.6} strokeDasharray={`${8 + i * 6} ${5 + i * 3}`} />
        ))}
        <circle cx="100" cy="100" r="7" fill={fg} />
      </g>
    );
  } else if (art === "waves") {
    body = (
      <g>
        {Array.from({ length: 14 }, (_, i) => {
          const y = 22 + i * 12;
          const amp = 3 + Math.sin(i * 0.7) * 10 + 7;
          let d = `M-20 ${y}`;
          for (let x = -20; x <= 220; x += 10) d += ` L${x} ${y + Math.sin(x / 14 + i * 0.5) * amp}`;
          return <path key={i} d={d} fill="none" stroke={fg} strokeWidth={1.4 + (i % 4 === 0 ? 1.8 : 0)} className="wave" style={{ animationDelay: `${i * -0.25}s` }} />;
        })}
      </g>
    );
  } else if (art === "grid") {
    body = (
      <g>
        {Array.from({ length: 12 }, (_, y) =>
          Array.from({ length: 12 }, (_, x) => {
            const v = r();
            return <rect key={x + "-" + y} x={12 + x * 15} y={12 + y * 15} width="11" height="11" rx={v > 0.8 ? 6 : 1} fill={v > 0.55 ? fg : "none"} stroke={fg} strokeWidth="1" opacity={v > 0.55 ? 0.35 + v * 0.65 : 0.4} className={v > 0.9 ? "blink" : ""} style={{ animationDelay: `${v * 3}s` }} />;
          })
        )}
      </g>
    );
  } else if (art === "nodes") {
    const nodes = Array.from({ length: 16 }, () => ({ x: 20 + r() * 160, y: 20 + r() * 160, s: 3 + r() * 7 }));
    body = (
      <g>
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b, j) => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            return d < 62 ? <line key={i + "-" + j} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={fg} strokeWidth="1.2" opacity=".6" /> : null;
          })
        )}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.s} fill={i % 4 === 0 ? p.color : fg} className={i % 4 === 0 ? "blink" : ""} style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </g>
    );
  } else {
    body = (
      <g>
        {Array.from({ length: 28 }, (_, i) => {
          const a = (-90 + (i - 13.5) * 6.2) * (Math.PI / 180);
          return <line key={i} x1="100" y1="190" x2={100 + Math.cos(a) * 170} y2={190 + Math.sin(a) * 170} stroke={fg} strokeWidth={i % 5 === 0 ? 3.2 : 1.2} className="fan" style={{ animationDelay: `${i * -0.12}s` }} />;
        })}
        <circle cx="100" cy="190" r="16" fill={fg} />
      </g>
    );
  }

  return (
    <svg ref={ref} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className={`${className} ${visible ? "art-live" : "art-static"}`} style={{ background: bg, display: "block", width: "100%", height: "100%" }}>
      {body}
    </svg>
  );
}
