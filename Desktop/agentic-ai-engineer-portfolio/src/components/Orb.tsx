import { useEffect, useRef } from "react";
import { AGENTS } from "../agents/engine";

// A little point-cloud brain with seven agents orbiting it.
export function Orb() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let mx = 0,
      my = 0,
      smx = 0,
      smy = 0;
    const N = 120;
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, ci: i % 11 === 0 ? i % AGENTS.length : -1 };
    });
    const trails: { x: number; y: number }[][] = AGENTS.map(() => []);

    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    const draw = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth,
        h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      smx += (mx - smx) * 0.05;
      smy += (my - smy) * 0.05;
      const t = time / 1000;
      const R = h * 0.42;
      const cx = w / 2,
        cy = h / 2;
      const ay = t * 0.35 + smx * 1.2;
      const ax = 0.35 + smy * 0.5;
      const cay = Math.cos(ay),
        say = Math.sin(ay),
        cax = Math.cos(ax),
        sax = Math.sin(ax);
      const proj = pts.map((p) => {
        let x = p.x * cay + p.z * say;
        let z = -p.x * say + p.z * cay;
        const y = p.y * cax - z * sax;
        z = p.y * sax + z * cax;
        const s = 1 / (1.8 - z * 0.5);
        return { x: cx + x * R * s * 1.8, y: cy + y * R * s * 1.8, z, s, ci: p.ci, ox: x, oy: y, oz: z };
      });
      // edges
      ctx.lineWidth = 0.6;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = proj[i],
            b = proj[j];
          const d = Math.hypot(a.ox - b.ox, a.oy - b.oy, a.oz - b.oz);
          if (d < 0.5) {
            const al = (1 - d / 0.5) * 0.45 * ((a.z + b.z) / 2 + 1.2) * 0.6;
            ctx.strokeStyle = `rgba(237,232,221,${al})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of proj) {
        const r = (p.ci >= 0 ? 2.6 : 1.4) * p.s * 1.7;
        ctx.fillStyle = p.ci >= 0 ? AGENTS[p.ci].color : `rgba(237,232,221,${0.35 + (p.z + 1) * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, 7);
        ctx.fill();
      }
      // orbiting agents
      AGENTS.forEach((a, i) => {
        const sp = 0.35 + i * 0.07;
        const ph = t * sp + i * 1.9;
        const rx = w * (0.28 + (i % 4) * 0.055);
        const ry = h * (0.28 + (i % 3) * 0.07);
        const tilt = (i - 3) * 0.09;
        const ex = Math.cos(ph) * rx,
          ey = Math.sin(ph) * ry;
        const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt) * 0.3;
        const y = cy + ey * Math.cos(tilt) + ex * Math.sin(tilt) * 0.3;
        const tr = trails[i];
        tr.push({ x, y });
        if (tr.length > 22) tr.shift();
        for (let k = 0; k < tr.length; k++) {
          ctx.globalAlpha = (k / tr.length) * 0.5;
          ctx.fillStyle = a.color;
          ctx.beginPath();
          ctx.arc(tr[k].x, tr[k].y, (k / tr.length) * 2.8, 0, 7);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, 7);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="orb-canvas" />;
}
