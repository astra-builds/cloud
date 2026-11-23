export type Project = {
  id: string;
  name: string;
  year: string;
  kind: string;
  blurb: string;
  long: string;
  metric: string;
  metricLabel: string;
  stack: string[];
  color: string;
  art: "rings" | "waves" | "grid" | "nodes" | "fan";
  bg: string;
  fg: string;
};

export const PROJECTS: Project[] = [
  {
    id: "monolith",
    name: "MONOLITH",
    year: "Current",
    kind: "Autonomous orchestration engine",
    blurb: "Natural language in. Adaptive execution out.",
    long: "A personal orchestration engine that turns natural-language intent into structured plans, constraint-aware schedules, and adaptive execution timelines. It combines deterministic scheduling, AI-driven reasoning, and local-first intelligence in an intentionally brutalist interface.",
    metric: "Local-first",
    metricLabel: "planning and execution",
    stack: ["Python", "LLM reasoning", "Scheduling", "Automation"],
    color: "#FF4D2E",
    art: "rings",
    bg: "#FF4D2E",
    fg: "#0F0F0D",
  },
  {
    id: "jhutlink",
    name: "Jhutlink",
    year: "Current",
    kind: "AI-native B2B SaaS",
    blurb: "Textile waste, routed to its next useful life.",
    long: "An AI-native B2B platform connecting textile waste generators directly with recyclers, manufacturers, and entrepreneurs. The product is designed to make discovery and collaboration easier across the textile reuse ecosystem.",
    metric: "B2B",
    metricLabel: "textile reuse network",
    stack: ["AI-native SaaS", "Marketplace", "Automation", "Sustainability"],
    color: "#2F5BFF",
    art: "waves",
    bg: "#2F5BFF",
    fg: "#EDE8DD",
  },
  {
    id: "grandjury",
    name: "GrandJury",
    year: "Current",
    kind: "Open-source AI evaluation",
    blurb: "Pluralistic human evaluation for AI systems.",
    long: "Contributed to an open-source pluralistic human evaluation framework for assessing AI systems in production environments. The work connects practical developer workflows with better feedback and evaluation infrastructure.",
    metric: "Open source",
    metricLabel: "human evaluation framework",
    stack: ["AI evaluation", "Human feedback", "Developer tooling", "Open source"],
    color: "#7DC400",
    art: "grid",
    bg: "#0F0F0D",
    fg: "#B8F500",
  },
  {
    id: "research-crew",
    name: "AI Research Crew",
    year: "Current",
    kind: "Multi-agent research system",
    blurb: "Agents gather sources and shape the report.",
    long: "A multi-agent AI system for automated research, information gathering, and report generation. Built with CrewAI to coordinate focused roles across the research workflow.",
    metric: "Multi-agent",
    metricLabel: "research and reporting workflow",
    stack: ["CrewAI", "Python", "Information gathering", "Report generation"],
    color: "#00A896",
    art: "nodes",
    bg: "#DCD5C4",
    fg: "#0F0F0D",
  },
  {
    id: "luxury-travel",
    name: "Luxury Travel Consultant",
    year: "Current",
    kind: "Conversational AI assistant",
    blurb: "Personalized luxury travel, planned in conversation.",
    long: "An AI-powered travel assistant that provides personalized luxury travel recommendations and planning support, helping a traveler move from an initial idea to a more considered itinerary.",
    metric: "Personalized",
    metricLabel: "travel planning support",
    stack: ["LLM application", "Recommendations", "Conversation design", "Automation"],
    color: "#FF2E93",
    art: "fan",
    bg: "#FF2E93",
    fg: "#0F0F0D",
  },
];

export const ROSTER = [
  {
    name: "orchestrator",
    color: "#7C3AED",
    ink: "#fff",
    title: "Turns intent into useful execution.",
    body: "Designing agent workflows that break a goal into steps, choose tools, and keep the human in the loop when judgment matters.",
    chips: ["LangGraph", "LangChain", "CrewAI"],
    stat: "agent orchestration",
  },
  {
    name: "builder",
    color: "#2F5BFF",
    ink: "#fff",
    title: "Builds LLM applications people can use.",
    body: "From a focused chatbot to a multi-agent product, turning language model capabilities into clear, useful application flows.",
    chips: ["Python", "LLM apps", "APIs"],
    stat: "application development",
  },
  {
    name: "automator",
    color: "#00A896",
    ink: "#fff",
    title: "Connects the parts that slow teams down.",
    body: "Using automation to move information between systems and turn repeatable work into dependable workflows.",
    chips: ["n8n", "workflows", "integrations"],
    stat: "intelligent automation",
  },
  {
    name: "judge",
    color: "#FF4D2E",
    ink: "#fff",
    title: "Treats evaluation as part of the product.",
    body: "Interested in how people assess AI systems, how feedback becomes useful data, and how developer tooling can make that loop clearer.",
    chips: ["AI evaluation", "research", "feedback"],
    stat: "HumanJudge contributor",
  },
  {
    name: "analyst",
    color: "#FFA400",
    ink: "#0F0F0D",
    title: "Finds the signal in messy data.",
    body: "Data visualization and exploratory analysis that help people see patterns, trends, and decisions inside real-world datasets.",
    chips: ["data viz", "EDA", "SQL"],
    stat: "data science practice",
  },
  {
    name: "communicator",
    color: "#FF2E93",
    ink: "#fff",
    title: "Makes technical ideas easier to follow.",
    body: "Developer advocacy, documentation, tutorials, and clear explanations that help people try a tool and understand what it can do.",
    chips: ["documentation", "tutorials", "developer advocacy"],
    stat: "technical communication",
  },
];

export const GRAVE = [
  {
    name: "The Over-Eager Intern",
    born: "Mar 2024",
    died: "4 min later",
    epitaph: "Booked 41 meetings before anyone could say ‘calendar’.",
    lesson: "Rate-limit side effects, not tokens.",
  },
  {
    name: "Infinite Polite Loop",
    born: "Aug 2024",
    died: "turn 3,214",
    epitaph: "Two agents thanked each other until the budget ran out.",
    lesson: "Every loop needs an exit condition.",
  },
  {
    name: "The Cache Poet",
    born: "Jan 2025",
    died: "10/10 on a haiku",
    epitaph: "A judge that rated everything 10 because the prompt said ‘be generous’.",
    lesson: "Calibrate your judges against humans.",
  },
  {
    name: "Ghost in the Browser",
    born: "Jun 2025",
    died: "cookie banner #9",
    epitaph: "Clicked the same pop-up forever. It was the one that created it.",
    lesson: "Agents need a sense of déjà vu.",
  },
];

export const COMMITS = [
  {
    hash: "humanjudge",
    ref: "HEAD → now",
    msg: "Developer Advocate",
    where: "HumanJudge",
    when: "Jun 2026 — now",
    lane: 0,
    points: [
      "Prepared technical documentation and developer resources supporting platform adoption and demonstrations.",
      "Built integration tutorials showing GrandJury with Python, Streamlit, and FastAPI AI applications.",
    ],
  },
  {
    hash: "evaluator",
    ref: "research",
    msg: "AI Evaluator & Research Contributor",
    where: "HumanJudge",
    when: "May 2026 — now",
    lane: 1,
    points: ["Contributing to research on human evaluation infrastructure, developer workflows, and feedback systems for AI agents."],
  },
  {
    hash: "flyrank",
    ref: "",
    msg: "Backend AI Engineer Intern",
    where: "FlyRank AI",
    when: "Jul 2026 — Oct 2026",
    lane: 0,
    points: ["Backend engineering internship focused on AI applications."],
  },
  {
    hash: "aiic",
    ref: "",
    msg: "Research Intern",
    where: "Scientific and Critical Research Institute · AIIC",
    when: "Aug 2026 — Oct 2026",
    lane: 0,
    points: ["Research internship assigned to the Academia-Industry Innovation Centre."],
  },
  {
    hash: "saintlouis",
    ref: "internship",
    msg: "Data Visualization Associate Intern",
    where: "Saint Louis University",
    when: "Jul 2025 — Sep 2025",
    lane: 0,
    points: [
      "Led analysis work, built an interactive dashboard, and surfaced trends across applicants, campaigns, and cohorts.",
    ],
  },
  {
    hash: "uiu-ds",
    ref: "education",
    msg: "B.Sc. Data Science",
    where: "United International University",
    when: "Aug 2025 — Dec 2029",
    lane: 0,
    points: ["Studying data science while building practical AI, automation, and evaluation projects."],
  },
];

export const PRINCIPLES = [
  { n: "01", t: "Autonomy is a dial, not a switch.", d: "Start at 20%. Earn the rest with evidence." },
  { n: "02", t: "Every tool call is a liability.", d: "Give agents fewer, sharper tools — and a budget." },
  { n: "03", t: "Judge the trajectory, not the answer.", d: "A right answer by a wrong path is a bug waiting." },
  { n: "04", t: "Boring infra beats clever prompts.", d: "Retries, traces and timeouts win quietly." },
];

export const STACK = [
  "Python", "LangGraph", "LangChain", "CrewAI", "n8n", "AI evaluation", "FastAPI", "Streamlit",
  "SQL", "Data visualization", "Automation", "LLM applications",
];

export type Step = { k: "plan" | "tool" | "think" | "err" | "retry" | "ok"; t: string; ms: number };
export type Scenario = {
  id: string;
  label: string;
  goal: string;
  steps: Step[];
  fail: Step[];
  summary: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "invoices",
    label: "Reconcile invoices",
    goal: "Reconcile Q3 invoices against the bank feed",
    steps: [
      { k: "plan", t: "plan → [fetch, match, flag, report]", ms: 500 },
      { k: "tool", t: "sql.query(invoices, q3) · 1,284 rows", ms: 650 },
      { k: "tool", t: "bank.feed(since=jul-01) · 1,301 rows", ms: 650 },
      { k: "think", t: "17 unmatched. fuzzy-match on ref + amount", ms: 600 },
      { k: "tool", t: "match.fuzzy(threshold=.92) · 14 resolved", ms: 650 },
      { k: "tool", t: "flag.human(3 items) → finance@", ms: 550 },
    ],
    fail: [
      { k: "err", t: "✗ bank.feed timeout (30s)", ms: 700 },
      { k: "retry", t: "↻ fallback: bank.csv_export, backoff 2s", ms: 600 },
    ],
    summary: "3 items escalated, 1,298 matched",
  },
  {
    id: "flaky",
    label: "Fix a flaky test",
    goal: "Find out why checkout.spec fails 1 in 12 runs",
    steps: [
      { k: "plan", t: "plan → [reproduce, bisect, hypothesise, patch]", ms: 500 },
      { k: "tool", t: "ci.history(checkout.spec, n=200) · 17 fails", ms: 650 },
      { k: "tool", t: "sandbox.run(--repeat 60) · reproduced ×5", ms: 700 },
      { k: "think", t: "all fails share a clock-skew window at :59s", ms: 600 },
      { k: "tool", t: "git.bisect → 3c1f9aa (new debounce)", ms: 650 },
      { k: "tool", t: "patch.apply(fake timers) · 60/60 green", ms: 600 },
    ],
    fail: [
      { k: "err", t: "✗ sandbox.run OOM-killed", ms: 700 },
      { k: "retry", t: "↻ resize 2→4GB, rerun with --shard 3", ms: 600 },
    ],
    summary: "root cause found, PR #482 opened",
  },
  {
    id: "launch",
    label: "Research competitors",
    goal: "Map the competitive landscape for a voice-agent startup",
    steps: [
      { k: "plan", t: "plan → [discover, read, verify, synthesise]", ms: 500 },
      { k: "tool", t: "search.web('voice agents clinics') · 38 hits", ms: 650 },
      { k: "tool", t: "browser.read × 12 pages (parallel)", ms: 700 },
      { k: "think", t: "3 claims conflict. spawn skeptic agent", ms: 600 },
      { k: "tool", t: "skeptic.verify · 2 sourced, 1 discarded", ms: 650 },
      { k: "tool", t: "memo.write(2 pages, 9 citations)", ms: 600 },
    ],
    fail: [
      { k: "err", t: "✗ browser.read 403 on competitor.io", ms: 700 },
      { k: "retry", t: "↻ switch to cached snapshot + archive.org", ms: 600 },
    ],
    summary: "memo ready · 9 citations · 1 claim dropped",
  },
];

export const HERO_LOOP: Scenario[] = SCENARIOS;
