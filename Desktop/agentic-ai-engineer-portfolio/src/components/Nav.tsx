const LINKS = [
  ["Work", "#work"],
  ["Agents", "#agents"],
  ["Lab", "#lab"],
  ["Path", "#path"],
];

export function Nav({ agentsOn, onToggle }: { agentsOn: boolean; onToggle: () => void }) {
  return (
    <header className="nav" data-build="nav" data-fx="dropY">
      <a href="#top" className="nav-logo" data-build="nav-logo" aria-label="Kamrul Hasan Ujjal — home">
        <svg width="18" height="22" viewBox="0 0 22 26" fill="none">
          <path d="M3 2.5v17.2l4.6-4.2 3.2 7.4 3.1-1.4-3.2-7.2h6.3L3 2.5Z" fill="#FF4D2E" stroke="#EDE8DD" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span>ujjal</span>
      </a>
      <nav className="nav-links">
        {LINKS.map(([l, h], i) => (
          <a key={l} href={h} data-build={`nav-l${i}`} className="nav-link">
            {l}
          </a>
        ))}
      </nav>
      <div className="nav-right">
        <button className={`nav-toggle ${agentsOn ? "on" : ""}`} onClick={onToggle} data-build="nav-toggle" title="Toggle the roaming agent cursors">
          <i /> <span>agents {agentsOn ? "on" : "off"}</span>
        </button>
        <a href="#contact" className="nav-cta" data-build="nav-cta">
          Hire me <span>↗</span>
        </a>
      </div>
    </header>
  );
}
