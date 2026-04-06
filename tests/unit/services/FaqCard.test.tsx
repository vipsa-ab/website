// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FaqCard } from "@/components/services/FaqCard";

const defaultProps = {
  question: "Ingår städmaterial i priset?",
  answer: "Vid hemstädning använder vi oftast kundens egna material.",
};

describe("FaqCard", () => {
  it("renders the question text", () => {
    render(<FaqCard {...defaultProps} />);
    expect(
      screen.getByText("Ingår städmaterial i priset?"),
    ).toBeInTheDocument();
  });

  it("does not show the answer by default", () => {
    render(<FaqCard {...defaultProps} />);
    expect(screen.queryByText(defaultProps.answer)).not.toBeInTheDocument();
  });

  it("shows the answer when the question is clicked", async () => {
    render(<FaqCard {...defaultProps} />);
    await act(async () => fireEvent.click(screen.getByRole("button")));
    expect(screen.getByText(defaultProps.answer)).toBeInTheDocument();
  });

  it("hides the answer when clicked again", async () => {
    render(<FaqCard {...defaultProps} />);
    const button = screen.getByRole("button");

    await act(async () => fireEvent.click(button));
    expect(screen.getByText(defaultProps.answer)).toBeInTheDocument();

    await act(async () => fireEvent.click(button));
    expect(screen.queryByText(defaultProps.answer)).not.toBeInTheDocument();
  });

  it("renders the expand icon SVG", () => {
    render(<FaqCard {...defaultProps} />);
    const svg = document.querySelector(
      'svg[data-icon="material-symbols:expand-more"]',
    );
    expect(svg).not.toBeNull();
  });
});
