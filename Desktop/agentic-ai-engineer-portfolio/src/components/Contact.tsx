import { useRef, useState } from "react";
import { useClock } from "../hooks";

export function Contact({ onGather, built }: { onGather: (el: HTMLElement | null) => void; built: string }) {
  const mail = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);
  const time = useClock("Asia/Dhaka");
  const email = "mintora1.1.1@gmail.com";

  const copy = () => {
    navigator.clipboard?.writeText(email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="sec-label mono" data-inspect>(06) Contact</div>
        <h2 className="contact-title" data-inspect>
          Let's put some <em>agents</em> to work.
        </h2>
        <a
          ref={mail}
          href={`mailto:${email}`}
          className="mail"
          onMouseEnter={() => onGather(mail.current)}
          onMouseLeave={() => onGather(null)}
          onClick={copy}
        >
          <span>{email}</span>
          <i className="mail-arrow">↗</i>
          <span className="mail-tip mono">{copied ? "copied ✓ · mail app opening" : "click to copy · open your mail app"}</span>
        </a>
        <div className="contact-row">
          <div className="links">
            {[
              ["GitHub", "https://github.com/astra-builds"],
              ["LinkedIn", "https://www.linkedin.com/in/kamrul-hasan-ujjal-467b0736a/"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="link-pill" target="_blank" rel="noreferrer">
                {l} <span>↗</span>
              </a>
            ))}
          </div>
          <div className="mono contact-note">
            Interested in: agentic AI · LLM applications · automation · AI evaluation · data visualization
          </div>
        </div>
        <footer className="foot mono">
          <span>© 2026 Kamrul Hasan Ujjal</span>
          <span>{built}</span>
          <span>Dhaka · {time}</span>
        </footer>
      </div>
    </section>
  );
}
