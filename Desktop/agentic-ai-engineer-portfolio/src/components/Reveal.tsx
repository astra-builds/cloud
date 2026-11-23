import type { ReactNode, CSSProperties } from "react";
import { useInView } from "../hooks";

export function Reveal({ children, delay = 0, className = "", as: Tag = "div", style }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li" | "article"; style?: CSSProperties }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.12);
  return (
    <Tag ref={ref as never} className={`rv ${seen ? "in" : ""} ${className}`} style={{ ["--d" as string]: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}

/** Headline whose words slide up out of a mask when scrolled into view. */
export function MaskTitle({ lines, className = "" }: { lines: (string | { em: string })[]; className?: string }) {
  const [ref, seen] = useInView<HTMLHeadingElement>(0.2);
  let n = 0;
  return (
    <h2 ref={ref} className={`h2 ${seen ? "in" : ""} ${className}`}>
      {lines.map((l, i) => {
        const isEm = typeof l !== "string";
        const text = isEm ? l.em : l;
        return (
          <span key={i} className="h2-line">
            {text.split(" ").map((w, j) => (
              <span className="mask" key={j}>
                <span style={{ ["--d" as string]: `${n++ * 70}ms` }} className={isEm ? "em" : ""}>
                  {w}&nbsp;
                </span>
              </span>
            ))}
          </span>
        );
      })}
    </h2>
  );
}
