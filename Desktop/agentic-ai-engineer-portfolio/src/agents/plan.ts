import type { Plan } from "./engine";

// Who builds what. Each agent has its own queue; all queues run at the same time.
export const PLAN: Plan = {
  planner: {
    delay: 0,
    tasks: [
      { kind: "build", id: "meta-label", mode: "drag", fx: "wipe", log: "labelled the canvas" },
      { kind: "build", id: "meta-pill", mode: "click", fx: "pop", log: "located the engineer" },
      { kind: "build", id: "stats", mode: "drag", fx: "rise", log: "pinned the toolkit" },
    ],
  },
  nav: {
    delay: 120,
    tasks: [
      { kind: "build", id: "nav", mode: "drag", fx: "dropY", log: "mounted <Nav/>" },
      { kind: "build", id: "nav-logo", mode: "click", fx: "pop", log: "stamped the logo" },
      { kind: "build", id: "nav-l0", mode: "click", fx: "pop", log: "wired /work" },
      { kind: "build", id: "nav-l1", mode: "click", fx: "pop", log: "wired /agents" },
      { kind: "build", id: "nav-l2", mode: "click", fx: "pop", log: "wired /lab" },
      { kind: "build", id: "nav-l3", mode: "click", fx: "pop", log: "wired /path" },
      { kind: "build", id: "nav-toggle", mode: "click", fx: "pop", log: "added the agents switch" },
      { kind: "build", id: "nav-cta", mode: "click", fx: "pop", log: "shipped the CTA" },
    ],
  },
  type: {
    delay: 260,
    tasks: [
      { kind: "build", id: "t-kamrul", mode: "type", fx: "none", log: "typeset KAMRUL" },
      { kind: "build", id: "t-hasan", mode: "type", fx: "none", log: "kerned Hasan (serif, italic)" },
      { kind: "build", id: "t-ujjal", mode: "type", fx: "none", log: "typeset UJJAL" },
    ],
  },
  pixel: {
    delay: 180,
    tasks: [
      { kind: "build", id: "orb", mode: "drag", fx: "wipe", log: "spun up the agent orb" },
      { kind: "build", id: "sticker", mode: "click", fx: "sticker", log: "slapped on a sticker" },
    ],
  },
  copy: {
    delay: 380,
    tasks: [
      { kind: "build", id: "blurb", mode: "drag", fx: "wipe", log: "drafted the pitch" },
      { kind: "build", id: "cta", mode: "drag", fx: "rise", log: "placed two buttons" },
      { kind: "build", id: "trace", mode: "drag", fx: "wipeY", log: "attached a live trace" },
    ],
  },
  gallery: {
    delay: 520,
    tasks: [
      { kind: "build", id: "card-0", mode: "carry", log: "hung MONOLITH" },
      { kind: "build", id: "card-1", mode: "carry", log: "hung Jhutlink" },
      { kind: "build", id: "card-2", mode: "carry", log: "hung GrandJury" },
    ],
  },
  ticker: {
    delay: 420,
    tasks: [
      { kind: "build", id: "marquee", mode: "drag", fx: "wipe", log: "rolled out the ticker" },
      { kind: "build", id: "clock", mode: "click", fx: "pop", log: "synced Dhaka time" },
      { kind: "build", id: "card-3", mode: "carry", log: "hung AI Research Crew" },
    ],
  },
};
