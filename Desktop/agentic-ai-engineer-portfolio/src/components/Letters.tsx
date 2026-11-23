export function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span key={i} className="ch" style={{ ["--i" as string]: i }} aria-hidden>
          {c}
        </span>
      ))}
    </>
  );
}
