// A tiny multi-cursor choreography engine.
// Cursors are real DOM overlays that drag selection boxes over real DOM elements,
// which are then "built" (revealed) the moment the cursor lets go.

export type AgentDef = { id: string; name: string; color: string; ink?: string };

export const AGENTS: AgentDef[] = [
  { id: "planner", name: "planner", color: "#7C3AED" },
  { id: "nav", name: "nav-bot", color: "#2F5BFF" },
  { id: "type", name: "type-smith", color: "#FF4D2E" },
  { id: "pixel", name: "pixel", color: "#FF2E93" },
  { id: "copy", name: "copy-pilot", color: "#00A896" },
  { id: "gallery", name: "curator", color: "#7DC400", ink: "#0E0E0C" },
  { id: "ticker", name: "tick-tock", color: "#FFA400", ink: "#0E0E0C" },
];

export type Task =
  | { kind: "guides"; v?: string[]; h?: string[]; log: string }
  | {
      kind: "build";
      id: string;
      mode?: "drag" | "click" | "type" | "carry";
      fx?: string;
      log: string;
      hold?: number;
    };

export type Plan = Record<string, { delay: number; tasks: Task[] }>;

type Hooks = {
  onLog: (agent: AgentDef, text: string) => void;
  onProgress: (done: number, total: number) => void;
  onDone: (ms: number) => void;
};

const ease = {
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  linear: (t: number) => t,
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

class Cursor {
  el: HTMLDivElement;
  chip: HTMLSpanElement;
  x = -100;
  y = -100;
  epoch = 0;
  constructor(public def: AgentDef, layer: HTMLElement, public eng: Engine) {
    this.el = document.createElement("div");
    this.el.className = "agent-cursor";
    this.el.style.setProperty("--c", def.color);
    this.el.style.setProperty("--ink", def.ink ?? "#fff");
    this.el.innerHTML = `<svg width="22" height="26" viewBox="0 0 22 26" fill="none"><path d="M3 2.5v17.2l4.6-4.2 3.2 7.4 3.1-1.4-3.2-7.2h6.3L3 2.5Z" fill="${def.color}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
    this.chip = document.createElement("span");
    this.chip.className = "agent-chip";
    this.chip.textContent = def.name;
    this.el.appendChild(this.chip);
    layer.appendChild(this.el);
    this.set(-100, -100);
  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.el.style.transform = `translate3d(${x}px,${y}px,0)`;
  }
  interrupt() {
    this.epoch++;
  }
  async moveTo(x: number, y: number, ms?: number, easing = ease.inOut) {
    const ep = this.epoch;
    const x0 = this.x,
      y0 = this.y;
    const dx = x - x0,
      dy = y - y0;
    const dist = Math.hypot(dx, dy) || 1;
    const dur = ms ?? clamp(240 + dist * 0.42, 300, 760);
    const bend = (Math.random() - 0.5) * Math.min(dist * 0.4, 180);
    const cx = x0 + dx / 2 - (dy / dist) * bend;
    const cy = y0 + dy / 2 + (dx / dist) * bend;
    return this.eng.tween(
      dur,
      easing,
      (t) => {
        const u = 1 - t;
        this.set(u * u * x0 + 2 * u * t * cx + t * t * x, u * u * y0 + 2 * u * t * cy + t * t * y);
      },
      () => this.epoch === ep
    );
  }
  setLabel(s?: string) {
    this.chip.textContent = s ?? this.def.name;
  }
}

class SelBox {
  el: HTMLDivElement;
  chip: HTMLSpanElement;
  constructor(layer: HTMLElement, color: string, ink: string, label: string) {
    this.el = document.createElement("div");
    this.el.className = "selbox";
    this.el.style.setProperty("--c", color);
    this.el.style.setProperty("--ink", ink);
    this.el.innerHTML = `<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i>`;
    this.chip = document.createElement("span");
    this.chip.className = "selchip";
    this.chip.textContent = label;
    this.el.appendChild(this.chip);
    layer.appendChild(this.el);
  }
  update(x0: number, y0: number, x1: number, y1: number, label?: string) {
    const l = Math.min(x0, x1),
      t = Math.min(y0, y1),
      w = Math.abs(x1 - x0),
      h = Math.abs(y1 - y0);
    this.el.style.transform = `translate3d(${l}px,${t}px,0)`;
    this.el.style.width = w + "px";
    this.el.style.height = h + "px";
    if (label) this.chip.textContent = label;
  }
  fade(ms = 500) {
    this.el.classList.add("done");
    setTimeout(() => this.el.remove(), ms);
  }
  remove() {
    this.el.remove();
  }
}

export class Engine {
  // Keeps the full cursor choreography visible while trimming idle time between moves.
  // The animation remains deliberate; it simply reaches the finished canvas sooner.
  readonly tempo = 0.78;
  layer: HTMLDivElement;
  cursors: Record<string, Cursor> = {};
  skipped = false;
  dead = false;
  ambientOn = true;
  waiters = new Set<() => void>();
  gatherEl: HTMLElement | null = null;
  claimed = new Set<Element>();
  total = 0;
  done = 0;
  t0 = 0;
  guides: HTMLElement[] = [];

  constructor(private hooks: Hooks) {
    this.layer = document.createElement("div");
    this.layer.className = "agent-layer";
    document.body.appendChild(this.layer);
    AGENTS.forEach((a) => (this.cursors[a.id] = new Cursor(a, this.layer, this)));
  }

  destroy() {
    this.dead = true;
    this.skip();
    this.layer.remove();
  }

  skip() {
    this.skipped = true;
    this.waiters.forEach((w) => w());
    this.waiters.clear();
  }

  sleep(ms: number) {
    return new Promise<void>((res) => {
      if (this.skipped) return res();
      const w = () => {
        clearTimeout(id);
        res();
      };
      const id = setTimeout(() => {
        this.waiters.delete(w);
        res();
      }, ms * this.tempo);
      this.waiters.add(w);
    });
  }

  tween(ms: number, easing: (t: number) => number, fn: (t: number) => void, alive?: () => boolean) {
    return new Promise<boolean>((res) => {
      if (this.skipped || this.dead) {
        fn(1);
        return res(true);
      }
      const start = performance.now();
      const duration = ms * this.tempo;
      const step = (now: number) => {
        if (this.dead) return res(false);
        if (this.skipped) {
          fn(1);
          return res(true);
        }
        if (alive && !alive()) return res(false);
        const p = clamp((now - start) / duration, 0, 1);
        fn(easing(p));
        if (p < 1) requestAnimationFrame(step);
        else res(true);
      };
      requestAnimationFrame(step);
    });
  }

  private find(id: string) {
    return document.querySelector<HTMLElement>(`[data-build="${id}"]`);
  }

  private vp() {
    return { w: window.innerWidth, h: window.innerHeight };
  }

  private markBuilt(el: HTMLElement, fx: string | undefined, agent: AgentDef) {
    el.style.setProperty("--agent", agent.color);
    if (fx) el.dataset.fx = fx;
    el.classList.remove("carrying", "lifted");
    el.classList.add("built");
  }

  private tick(agent: AgentDef, text: string) {
    this.done++;
    this.hooks.onLog(agent, text);
    this.hooks.onProgress(this.done, this.total);
  }

  // ---------------------------------------------------------------- tasks
  private async doBuild(cur: Cursor, t: Extract<Task, { kind: "build" }>) {
    const el = this.find(t.id);
    if (!el) {
      this.done++;
      return;
    }
    const { w: vw, h: vh } = this.vp();
    const r = el.getBoundingClientRect();
    const fx = t.fx ?? el.dataset.fx;
    if (this.skipped || r.top > vh - 8 || r.bottom < 0 || r.width < 2) {
      this.markBuilt(el, fx, cur.def);
      this.done++;
      this.hooks.onProgress(this.done, this.total);
      return;
    }
    const mode = t.mode ?? "drag";
    const x0 = clamp(r.left, 4, vw - 4),
      y0 = clamp(r.top, 4, vh - 4),
      x1 = clamp(r.right, 4, vw - 4),
      y1 = clamp(r.bottom, 4, vh - 4);
    const dims = `${Math.round(r.width)}×${Math.round(r.height)}`;

    if (mode === "carry") {
      // cursor grabs the element from off-canvas and drops it into place
      const side = Math.random() < 0.5 ? -1 : 1;
      const sx = clamp(x0 + (x1 - x0) / 2 + side * rand(300, 700), -40, vw + 40);
      const sy = vh + rand(40, 120);
      await cur.moveTo(sx, sy, 230, ease.out);
      const cx = (x0 + x1) / 2,
        cy = (y0 + y1) / 2;
      const rot = side * rand(4, 9);
      el.classList.add("carrying", "lifted");
      el.style.transition = "none";
      el.style.setProperty("--agent", cur.def.color);
      const apply = (px: number, py: number, k: number) => {
        el.style.transform = `translate3d(${px - cx}px,${py - cy}px,0) rotate(${rot * k}deg) scale(${1 + 0.05 * k})`;
      };
      apply(sx, sy, 1);
      const ep = cur.epoch;
      const dur = clamp(Math.hypot(cx - sx, cy - sy) * 0.55, 520, 900);
      const sxx = sx,
        syy = sy;
      await this.tween(dur, ease.outExpo, (k) => {
        const px = sxx + (cx - sxx) * k,
          py = syy + (cy - syy) * k;
        cur.set(px, py);
        apply(px, py, 1 - k * 0.8);
      }, () => cur.epoch === ep);
      el.style.transition = "transform .45s cubic-bezier(.3,1.6,.5,1), box-shadow .45s";
      el.style.transform = "";
      el.classList.remove("lifted");
      await this.sleep(120);
      this.markBuilt(el, "none", cur.def);
      setTimeout(() => (el.style.transition = ""), 520);
      this.ring(cur, cx, cy);
      this.tick(cur.def, t.log);
      await this.sleep(t.hold ?? 80);
      return;
    }

    if (mode === "click") {
      await cur.moveTo((x0 + x1) / 2 + rand(-4, 4), (y0 + y1) / 2 + rand(-3, 3), undefined, ease.inOut);
      cur.el.classList.add("down");
      await this.sleep(70);
      this.ring(cur, cur.x, cur.y);
      this.markBuilt(el, fx ?? "pop", cur.def);
      cur.el.classList.remove("down");
      this.tick(cur.def, t.log);
      await this.sleep(t.hold ?? 90);
      return;
    }

    // drag / type
    await cur.moveTo(x0, y0);
    const box = new SelBox(this.layer, cur.def.color, cur.def.ink ?? "#fff", dims);
    box.update(x0, y0, x0, y0);
    cur.el.classList.add("down");
    await this.sleep(60);
    const dur = mode === "type" ? 380 : clamp(Math.hypot(x1 - x0, y1 - y0) * 0.55, 260, 520);
    const ep = cur.epoch;
    await this.tween(dur, ease.out, (k) => {
      const px = x0 + (x1 - x0) * k,
        py = y0 + (y1 - y0) * k;
      cur.set(px, py);
      box.update(x0, y0, px, py, `${Math.round(Math.abs(px - x0))}×${Math.round(Math.abs(py - y0))}`);
    }, () => cur.epoch === ep);
    cur.el.classList.remove("down");
    box.update(x0, y0, x1, y1, dims);
    this.ring(cur, cur.x, cur.y);
    this.markBuilt(el, fx, cur.def);
    this.tick(cur.def, t.log);
    if (mode === "type") {
      // cursor rides the text as it appears
      const ty = (y0 + y1) / 2;
      const dd = clamp((x1 - x0) * 0.9, 380, 900);
      el.style.setProperty("--ld", `${Math.round(dd / Math.max(1, (el.dataset.chars ? +el.dataset.chars : 8)))}ms`);
      cur.set(x0, ty);
      box.fade(700);
      await this.tween(dd, ease.out, (k) => cur.set(x0 + (x1 - x0) * k, ty + Math.sin(k * 7) * 6), () => cur.epoch === ep);
    } else {
      box.fade(550);
      await this.sleep(t.hold ?? 60);
    }
  }

  private ring(cur: Cursor, x: number, y: number) {
    const r = document.createElement("div");
    r.className = "click-ring";
    r.style.setProperty("--c", cur.def.color);
    r.style.left = x + "px";
    r.style.top = y + "px";
    this.layer.appendChild(r);
    setTimeout(() => r.remove(), 700);
  }

  private async doGuides(cur: Cursor, t: Extract<Task, { kind: "guides" }>) {
    const { w: vw, h: vh } = this.vp();
    const mk = (vertical: boolean) => {
      const g = document.createElement("div");
      g.className = "guide " + (vertical ? "v" : "h");
      g.style.setProperty("--c", cur.def.color);
      this.layer.appendChild(g);
      this.guides.push(g);
      return g;
    };
    const items: { vertical: boolean; pos: number }[] = [];
    (t.v ?? []).forEach((id) => {
      const el = this.find(id);
      if (el) items.push({ vertical: true, pos: el.getBoundingClientRect().left });
    });
    (t.h ?? []).forEach((id) => {
      const el = this.find(id);
      if (el) items.push({ vertical: false, pos: el.getBoundingClientRect().top });
    });
    for (const it of items) {
      if (it.pos < 0 || it.pos > (it.vertical ? vw : vh)) continue;
      const g = mk(it.vertical);
      const ep = cur.epoch;
      if (it.vertical) {
        await cur.moveTo(0, vh * rand(0.3, 0.7), 260);
        cur.el.classList.add("down");
        await this.tween(360, ease.out, (k) => {
          const x = it.pos * k;
          cur.set(x, cur.y);
          g.style.transform = `translate3d(${x}px,0,0)`;
        }, () => cur.epoch === ep);
      } else {
        await cur.moveTo(vw * rand(0.3, 0.7), 0, 260);
        cur.el.classList.add("down");
        await this.tween(360, ease.out, (k) => {
          const y = it.pos * k;
          cur.set(cur.x, y);
          g.style.transform = `translate3d(0,${y}px,0)`;
        }, () => cur.epoch === ep);
      }
      cur.el.classList.remove("down");
    }
    this.tick(cur.def, t.log);
  }

  // ---------------------------------------------------------------- run
  async run(plan: Plan) {
    this.t0 = performance.now();
    this.total = Object.values(plan).reduce((n, p) => n + p.tasks.length, 0);
    const vw = window.innerWidth,
      vh = window.innerHeight;
    const jobs = AGENTS.map(async (a, i) => {
      const cur = this.cursors[a.id];
      const p = plan[a.id];
      // spawn off-canvas at an edge
      const edge = i % 4;
      const sx = edge === 0 ? -60 : edge === 1 ? vw + 60 : rand(0, vw);
      const sy = edge === 2 ? -60 : edge === 3 ? vh + 60 : rand(0, vh);
      cur.set(sx, sy);
      cur.el.classList.add("visible");
      if (!p) return;
      await this.sleep(p.delay);
      for (const t of p.tasks) {
        if (this.dead) return;
        if (t.kind === "guides") await this.doGuides(cur, t);
        else await this.doBuild(cur, t);
      }
    });
    await Promise.all(jobs);
    if (this.dead) return;
    this.skipped = false;
    // everything leftover (safety)
    document.querySelectorAll<HTMLElement>("[data-build]:not(.built)").forEach((el) => el.classList.add("built"));
    this.guides.forEach((g) => g.classList.add("gone"));
    setTimeout(() => this.guides.forEach((g) => g.remove()), 700);
    this.hooks.onDone(performance.now() - this.t0);
    this.ambient();
  }

  // ---------------------------------------------------------------- ambient life
  setAmbient(on: boolean) {
    this.ambientOn = on;
    this.layer.classList.toggle("off", !on);
  }

  gather(el: HTMLElement | null) {
    this.gatherEl = el;
    if (el) Object.values(this.cursors).forEach((c) => c.interrupt());
  }

  private visibleTargets() {
    const vh = window.innerHeight;
    return Array.from(document.querySelectorAll<HTMLElement>("[data-inspect]")).filter((e) => {
      const r = e.getBoundingClientRect();
      return r.bottom > 60 && r.top < vh - 60 && r.width > 30 && r.height > 14 && !this.claimed.has(e);
    });
  }

  private async ambient() {
    // gather to the middle first, then disperse to their own life
    await this.sleep(this.skipped ? 0 : 600);
    AGENTS.forEach((a, i) => this.life(this.cursors[a.id], i));
  }

  private async life(cur: Cursor, idx: number) {
    await new Promise((r) => setTimeout(r, 400 + idx * 650));
    const verbs = ["reviewing", "linting", "tweaking", "measuring", "testing", "vibing", "tracing", "polishing"];
    while (!this.dead) {
      if (!this.ambientOn) {
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      if (this.gatherEl) {
        const r = this.gatherEl.getBoundingClientRect();
        const ang = (idx / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
        const gx = r.left + r.width / 2 + Math.cos(ang) * (r.width * 0.5 + 40 + (idx % 2) * 30);
        const gy = r.top + r.height / 2 + Math.sin(ang) * (r.height * 0.5 + 40 + (idx % 2) * 24);
        await cur.moveTo(gx, gy, 700 + idx * 60, ease.outExpo);
        while (this.gatherEl && !this.dead) {
          // restless jitter around the target
          await cur.moveTo(gx + rand(-14, 14), gy + rand(-14, 14), 380, ease.inOut);
        }
        continue;
      }
      const targets = this.visibleTargets();
      const vw = window.innerWidth,
        vh = window.innerHeight;
      if (targets.length && Math.random() < 0.8) {
        const el = targets[Math.floor(Math.random() * targets.length)];
        this.claimed.add(el);
        const r = el.getBoundingClientRect();
        const x0 = clamp(r.left, 6, vw - 6),
          y0 = clamp(r.top, 6, vh - 6),
          x1 = clamp(r.right, 6, vw - 6),
          y1 = clamp(r.bottom, 6, vh - 6);
        await cur.moveTo(x0, y0);
        if (!this.gatherEl) {
          const box = new SelBox(this.layer, cur.def.color, cur.def.ink ?? "#fff", `${cur.def.name} · ${verbs[Math.floor(Math.random() * verbs.length)]}`);
          box.update(x0, y0, x0, y0);
          cur.el.classList.add("down");
          const ep = cur.epoch;
          const ok = await this.tween(rand(420, 700), ease.out, (k) => {
            const px = x0 + (x1 - x0) * k,
              py = y0 + (y1 - y0) * k;
            cur.set(px, py);
            box.update(x0, y0, px, py);
          }, () => cur.epoch === ep);
          cur.el.classList.remove("down");
          if (ok) await new Promise((r) => setTimeout(r, rand(900, 2000)));
          box.fade(400);
        }
        this.claimed.delete(el);
      } else {
        await cur.moveTo(rand(40, vw - 40), rand(80, vh - 40), rand(900, 1600));
      }
      await new Promise((r) => setTimeout(r, rand(300, 2600)));
    }
  }
}
