// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CalculatorSection } from "@/components/pricing/CalculatorSection";

function getPrice(id: string) {
  return screen
    .getByRole("heading", { level: 2 })
    .closest("section")!
    .querySelector(`#${id}`)!.textContent;
}

function selectFrequency(label: RegExp) {
  const radio = screen.getByRole("radio", { name: label });
  return act(async () => fireEvent.click(radio));
}

function setSlider(value: number) {
  const slider = screen.getByRole("slider");
  return act(async () =>
    fireEvent.change(slider, { target: { value: String(value) } }),
  );
}

describe("CalculatorSection — default state", () => {
  it("renders the heading", () => {
    render(<CalculatorSection />);
    expect(
      screen.getByRole("heading", { name: /beräkna ditt pris/i }),
    ).toBeInTheDocument();
  });

  it("defaults to 75 kvm", () => {
    render(<CalculatorSection />);
    expect(screen.getByText("75 kvm")).toBeInTheDocument();
  });

  it("defaults to biweekly frequency (multiplier 1)", () => {
    render(<CalculatorSection />);
    const biweekly = screen.getByRole("radio", { name: /varannan vecka/i });
    expect(biweekly).toBeChecked();
  });

  it("shows correct default price (75 kvm, biweekly)", () => {
    render(<CalculatorSection />);
    // price = Math.round((75 / 36) * 390 * 1) = Math.round(812.5) = 813
    expect(screen.getByText("813 kr", { exact: false })).toBeInTheDocument();
  });
});

describe("CalculatorSection — slider interaction", () => {
  it("updates the kvm display when slider changes", async () => {
    render(<CalculatorSection />);
    await setSlider(120);
    expect(screen.getByText("120 kvm")).toBeInTheDocument();
  });

  it("recalculates price when slider changes", async () => {
    render(<CalculatorSection />);
    await setSlider(200);
    // price = Math.round((200 / 36) * 390 * 1) = Math.round(2166.67) = 2167
    expect(screen.getByText("2167 kr", { exact: false })).toBeInTheDocument();
  });

  it("shows before-RUT price as double the after-RUT price", async () => {
    render(<CalculatorSection />);
    await setSlider(200);
    // before = 2167 * 2 = 4334
    expect(screen.getByText("4334 kr", { exact: false })).toBeInTheDocument();
  });
});

describe("CalculatorSection — frequency selection", () => {
  it("selects weekly frequency", async () => {
    render(<CalculatorSection />);
    await selectFrequency(/varje vecka/i);
    expect(screen.getByRole("radio", { name: /varje vecka/i })).toBeChecked();
  });

  it("selects monthly frequency", async () => {
    render(<CalculatorSection />);
    await selectFrequency(/månatlig/i);
    expect(screen.getByRole("radio", { name: /månatlig/i })).toBeChecked();
  });

  it("applies weekly discount (0.9 multiplier)", async () => {
    render(<CalculatorSection />);
    await selectFrequency(/varje vecka/i);
    // price = Math.round((75 / 36) * 390 * 0.9) = Math.round(731.25) = 731
    expect(screen.getByText("731 kr", { exact: false })).toBeInTheDocument();
  });

  it("applies monthly surcharge (1.1 multiplier)", async () => {
    render(<CalculatorSection />);
    await selectFrequency(/månatlig/i);
    // price = Math.round((75 / 36) * 390 * 1.1) = Math.round(893.75) = 894
    expect(screen.getByText("894 kr", { exact: false })).toBeInTheDocument();
  });
});

describe("CalculatorSection — combined interactions", () => {
  it("recalculates when both slider and frequency change", async () => {
    render(<CalculatorSection />);
    await setSlider(150);
    await selectFrequency(/varje vecka/i);
    // price = Math.round((150 / 36) * 390 * 0.9) = Math.round(1462.5) = 1463
    expect(screen.getByText("1463 kr", { exact: false })).toBeInTheDocument();
  });

  it("before-RUT is always double the after-RUT price", async () => {
    render(<CalculatorSection />);
    await setSlider(100);
    await selectFrequency(/månatlig/i);
    // after = Math.round((100 / 36) * 390 * 1.1) = Math.round(1191.67) = 1192
    // before = 1192 * 2 = 2384
    expect(screen.getByText("1192 kr", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("2384 kr", { exact: false })).toBeInTheDocument();
  });
});

describe("CalculatorSection — boundary values", () => {
  it("handles minimum slider value (20 kvm)", async () => {
    render(<CalculatorSection />);
    await setSlider(20);
    expect(document.getElementById("kvm-display")).toHaveTextContent("20 kvm");
    // price = Math.round((20 / 36) * 390 * 1) = Math.round(216.67) = 217
    expect(screen.getByText("217 kr", { exact: false })).toBeInTheDocument();
  });

  it("handles maximum slider value (300 kvm)", async () => {
    render(<CalculatorSection />);
    await setSlider(300);
    expect(document.getElementById("kvm-display")).toHaveTextContent("300 kvm");
    // price = Math.round((300 / 36) * 390 * 1) = Math.round(3250) = 3250
    expect(screen.getByText("3250 kr", { exact: false })).toBeInTheDocument();
  });
});

describe("CalculatorSection — UI elements", () => {
  it("renders the Boka Nu button", () => {
    render(<CalculatorSection />);
    expect(
      screen.getByRole("button", { name: /boka nu/i }),
    ).toBeInTheDocument();
  });

  it("renders all three frequency options", () => {
    render(<CalculatorSection />);
    expect(
      screen.getByRole("radio", { name: /månatlig/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /varannan vecka/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /varje vecka/i }),
    ).toBeInTheDocument();
  });

  it("renders the slider with correct min and max", () => {
    render(<CalculatorSection />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "20");
    expect(slider).toHaveAttribute("max", "300");
    expect(slider).toHaveAttribute("step", "5");
  });
});
