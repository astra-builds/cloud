import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders the logo and nav links", () => {
    render(<Nav agentsOn={true} onToggle={() => {}} />);
    expect(screen.getByText("ujjal")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Agents")).toBeInTheDocument();
    expect(screen.getByText("Lab")).toBeInTheDocument();
    expect(screen.getByText("Path")).toBeInTheDocument();
  });

  it("renders the Hire me CTA", () => {
    render(<Nav agentsOn={true} onToggle={() => {}} />);
    expect(screen.getByText("Hire me")).toBeInTheDocument();
  });

  it("toggles agents on/off when clicking the toggle button", () => {
    render(<Nav agentsOn={true} onToggle={() => {}} />);
    const toggle = screen.getByText(/agents on/);
    fireEvent.click(toggle.closest("button")!);
  });

  it("renders agents off state", () => {
    render(<Nav agentsOn={false} onToggle={() => {}} />);
    expect(screen.getByText(/agents off/)).toBeInTheDocument();
  });
});
