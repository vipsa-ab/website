// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FaqCard } from "@/components/services/FaqCard";

const defaultProps = {
  question: "Test question?",
  answer: "Test answer content.",
};

describe("FaqCard — toggle behavior", () => {
  it("does not show the answer by default", () => {
    render(<FaqCard {...defaultProps} />);
    expect(screen.queryByText(defaultProps.answer)).not.toBeInTheDocument();
  });

  it("shows the answer when the button is clicked", async () => {
    render(<FaqCard {...defaultProps} />);
    await act(async () => fireEvent.click(screen.getByRole("button")));
    expect(screen.getByText(defaultProps.answer)).toBeInTheDocument();
  });

  it("hides the answer when clicked again (toggle off)", async () => {
    render(<FaqCard {...defaultProps} />);
    const button = screen.getByRole("button");

    await act(async () => fireEvent.click(button));
    expect(screen.getByText(defaultProps.answer)).toBeInTheDocument();

    await act(async () => fireEvent.click(button));
    expect(screen.queryByText(defaultProps.answer)).not.toBeInTheDocument();
  });

  it("renders the question as the button label", () => {
    render(<FaqCard {...defaultProps} />);
    expect(screen.getByRole("button")).toHaveTextContent(defaultProps.question);
  });
});
