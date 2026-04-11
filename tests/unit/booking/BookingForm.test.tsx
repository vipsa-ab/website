// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock all icon imports — they're SVG components, irrelevant to logic tests
vi.mock("~icons/material-symbols/home", () => ({
  default: (props: any) => <span data-testid="icon-home" {...props} />,
}));
vi.mock("~icons/material-symbols/local-shipping", () => ({
  default: (props: any) => <span data-testid="icon-shipping" {...props} />,
}));
vi.mock("~icons/material-symbols/corporate-fare", () => ({
  default: (props: any) => <span data-testid="icon-office" {...props} />,
}));
vi.mock("~icons/material-symbols/window", () => ({
  default: (props: any) => <span data-testid="icon-window" {...props} />,
}));
vi.mock("~icons/material-symbols/chevron-left", () => ({
  default: (props: any) => <span data-testid="icon-chevron-left" {...props} />,
}));
vi.mock("~icons/material-symbols/chevron-right", () => ({
  default: (props: any) => <span data-testid="icon-chevron-right" {...props} />,
}));
vi.mock("~icons/material-symbols/schedule", () => ({
  default: (props: any) => <span data-testid="icon-schedule" {...props} />,
}));
vi.mock("~icons/material-symbols/check-circle", () => ({
  default: (props: any) => <span data-testid="icon-check" {...props} />,
}));
vi.mock("~icons/material-symbols/nightlight", () => ({
  default: (props: any) => <span data-testid="icon-night" {...props} />,
}));
vi.mock("~icons/material-symbols/verified-user", () => ({
  default: (props: any) => <span data-testid="icon-verified" {...props} />,
}));
vi.mock("~icons/material-symbols/lock-open", () => ({
  default: (props: any) => <span data-testid="icon-lock" {...props} />,
}));
vi.mock("~icons/material-symbols/eco", () => ({
  default: (props: any) => <span data-testid="icon-eco" {...props} />,
}));

// Mock react-day-picker to avoid complex calendar rendering in unit tests
vi.mock("react-day-picker", () => ({
  DayPicker: ({ onSelect, selected }: any) => (
    <div data-testid="day-picker">
      <button
        data-testid="mock-select-date"
        type="button"
        onClick={() => {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 5);
          futureDate.setHours(0, 0, 0, 0);
          onSelect(futureDate);
        }}
      >
        Select date
      </button>
      {selected && (
        <span data-testid="selected-date">{selected.toISOString()}</span>
      )}
    </div>
  ),
}));

// Mock sonner
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock("sonner", () => ({
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
  Toaster: () => <div data-testid="toaster" />,
}));

import { BookingForm } from "@/components/booking/BookingForm";

beforeEach(() => {
  mockToastSuccess.mockClear();
  mockToastError.mockClear();
});

// --- Rendering & Structure ---

describe("BookingForm — rendering", () => {
  it("renders all four sections", () => {
    render(<BookingForm />);
    expect(screen.getByText("Välj Tjänst")).toBeInTheDocument();
    expect(screen.getByText("Bostadsinformation")).toBeInTheDocument();
    expect(screen.getByText(/Kalender/)).toBeInTheDocument();
    expect(screen.getByText("Kontaktuppgifter")).toBeInTheDocument();
  });

  it("renders the summary aside", () => {
    render(<BookingForm />);
    expect(screen.getByText("Sammanfattning")).toBeInTheDocument();
    expect(screen.getByText("Ditt pris")).toBeInTheDocument();
  });

  it("renders all four service radio options", () => {
    render(<BookingForm />);
    expect(
      screen.getByRole("radio", { name: /hemstädning/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /flyttstädning/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /kontorsstädning/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /fönsterputs/i }),
    ).toBeInTheDocument();
  });

  it("renders all three frequency options", () => {
    render(<BookingForm />);
    expect(screen.getByLabelText("Varje vecka")).toBeInTheDocument();
    expect(screen.getByLabelText("Varannan vecka")).toBeInTheDocument();
    expect(screen.getByLabelText("Månatlig")).toBeInTheDocument();
  });

  it("renders contact fields", () => {
    render(<BookingForm />);
    expect(screen.getByPlaceholderText("Erik Andersson")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("erik@exempel.se")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("070-123 45 67")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ÅÅMMDD-XXXX")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Storgatan 1, 123 45 Växjö"),
    ).toBeInTheDocument();
  });

  it("renders room selector with options 1-5", () => {
    render(<BookingForm />);
    const select = screen.getByLabelText("Antal rum");
    const options = within(select).getAllByRole("option");
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent("1 rum");
    expect(options[4]).toHaveTextContent("5+ rum");
  });

  it("renders trust badges", () => {
    render(<BookingForm />);
    expect(
      screen.getByText("Full ansvarsförsäkring ingår"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ingen bindningstid")).toBeInTheDocument();
    expect(screen.getByText("Svanenmärkt städning")).toBeInTheDocument();
  });
});

// --- Default State ---

describe("BookingForm — default values", () => {
  it("defaults to Hemstädning service", () => {
    render(<BookingForm />);
    const homeRadio = screen.getByRole("radio", { name: /hemstädning/i });
    expect(homeRadio).toBeChecked();
  });

  it("defaults to weekly frequency", () => {
    render(<BookingForm />);
    const weekly = screen.getByLabelText("Varje vecka");
    expect(weekly).toBeChecked();
  });

  it("defaults rooms to 1", () => {
    render(<BookingForm />);
    const select = screen.getByLabelText("Antal rum") as HTMLSelectElement;
    expect(select.value).toBe("1");
  });

  it("shows dash for price when no size entered", () => {
    render(<BookingForm />);
    const summarySection = screen.getByText("Sammanfattning").closest("div")!;
    const dashes = within(summarySection).getAllByText("—");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("submit button is disabled by default (form incomplete)", () => {
    render(<BookingForm />);
    const btn = screen.getByRole("button", { name: /bekräfta bokning/i });
    expect(btn).toBeDisabled();
  });
});

// --- Service Selection ---

describe("BookingForm — service selection", () => {
  it("selects Flyttstädning when clicked", async () => {
    render(<BookingForm />);
    const movingRadio = screen.getByRole("radio", { name: /flyttstädning/i });
    await act(async () => fireEvent.click(movingRadio));
    expect(movingRadio).toBeChecked();
  });

  it("updates summary label when switching service", async () => {
    render(<BookingForm />);
    const officeRadio = screen.getByRole("radio", {
      name: /kontorsstädning/i,
    });
    await act(async () => fireEvent.click(officeRadio));
    // Service name appears in both the card and the summary — verify at least 2 matches
    const matches = screen.getAllByText(/Kontorsstädning/);
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });
});

// --- Pricing Calculations ---

describe("BookingForm — pricing logic", () => {
  async function setSize(value: string) {
    const input = screen.getByPlaceholderText("t.ex. 75");
    await act(async () => {
      fireEvent.change(input, { target: { value } });
    });
  }

  async function selectService(name: RegExp) {
    const radio = screen.getByRole("radio", { name });
    await act(async () => fireEvent.click(radio));
  }

  async function selectFrequency(label: string) {
    const radio = screen.getByLabelText(label);
    await act(async () => fireEvent.click(radio));
  }

  it("calculates home cleaning price: 75kvm * 12 kr/kvm = 900 base", async () => {
    render(<BookingForm />);
    await setSize("75");
    // base=900, discount=100(weekly), fee=49 → beforeRut=849 → afterRut=425
    expect(screen.getByText("900 kr")).toBeInTheDocument();
  });

  it("applies weekly discount of 100 kr", async () => {
    render(<BookingForm />);
    await setSize("75");
    // default is weekly → discount = 100
    expect(screen.getByText("-100 kr")).toBeInTheDocument();
  });

  it("applies biweekly discount of 50 kr", async () => {
    render(<BookingForm />);
    await setSize("75");
    await selectFrequency("Varannan vecka");
    expect(screen.getByText("-50 kr")).toBeInTheDocument();
  });

  it("shows no discount for monthly frequency", async () => {
    render(<BookingForm />);
    await setSize("75");
    await selectFrequency("Månatlig");
    // No discount row should appear (discount = 0)
    expect(screen.queryByText(/-\d+ kr/)).not.toBeInTheDocument();
  });

  it("shows service fee of 49 kr", async () => {
    render(<BookingForm />);
    await setSize("75");
    expect(screen.getByText("49 kr")).toBeInTheDocument();
  });

  it("calculates before-RUT price correctly", async () => {
    render(<BookingForm />);
    await setSize("75");
    // base=900 - discount=100 + fee=49 = 849
    expect(screen.getByText("849 kr")).toBeInTheDocument();
  });

  it("calculates after-RUT as 50% of before-RUT", async () => {
    render(<BookingForm />);
    await setSize("75");
    // afterRut = Math.round(849 * 0.5) = 425
    expect(screen.getByText("425 kr")).toBeInTheDocument();
  });

  it("uses moving cleaning rate: 20 kr/kvm", async () => {
    render(<BookingForm />);
    await selectService(/flyttstädning/i);
    await setSize("50");
    // base = 50 * 20 = 1000
    expect(screen.getByText("1000 kr")).toBeInTheDocument();
  });

  it("uses office cleaning rate: 15 kr/kvm", async () => {
    render(<BookingForm />);
    await selectService(/kontorsstädning/i);
    await setSize("100");
    // base = 100 * 15 = 1500
    expect(screen.getByText("1500 kr")).toBeInTheDocument();
  });

  it("uses window cleaning rate: 8 kr/kvm", async () => {
    render(<BookingForm />);
    await selectService(/fönsterputs/i);
    await setSize("100");
    // base = 100 * 8 = 800
    expect(screen.getByText("800 kr")).toBeInTheDocument();
  });

  it("shows size in summary when >= 10 kvm", async () => {
    render(<BookingForm />);
    await setSize("80");
    expect(screen.getByText(/80 kvm/)).toBeInTheDocument();
  });

  it("does not show size in summary when < 10 kvm", async () => {
    render(<BookingForm />);
    await setSize("5");
    const summarySection = screen.getByText("Sammanfattning").closest("div")!;
    expect(within(summarySection).queryByText(/5 kvm/)).not.toBeInTheDocument();
  });
});

// --- Frequency Selection ---

describe("BookingForm — frequency interaction", () => {
  it("switches frequency radio buttons", async () => {
    render(<BookingForm />);
    const biweekly = screen.getByLabelText("Varannan vecka");
    await act(async () => fireEvent.click(biweekly));
    expect(biweekly).toBeChecked();
    expect(screen.getByLabelText("Varje vecka")).not.toBeChecked();
  });

  it("shows frequency label in summary discount row", async () => {
    render(<BookingForm />);
    const sizeInput = screen.getByPlaceholderText("t.ex. 75");
    await act(async () =>
      fireEvent.change(sizeInput, { target: { value: "75" } }),
    );
    // Default weekly
    expect(screen.getByText(/Varje vecka \(Rabatt\)/)).toBeInTheDocument();
  });
});

// --- Calendar & Time Slot ---

describe("BookingForm — calendar & time slots", () => {
  it("renders the DayPicker component", () => {
    render(<BookingForm />);
    expect(screen.getByTestId("day-picker")).toBeInTheDocument();
  });

  it("shows placeholder text when no date selected", () => {
    render(<BookingForm />);
    expect(
      screen.getByText("Välj ett datum för att se tider"),
    ).toBeInTheDocument();
  });

  it("renders month navigation buttons", () => {
    render(<BookingForm />);
    expect(
      screen.getByRole("button", { name: "Föregående månad" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nästa månad" }),
    ).toBeInTheDocument();
  });
});

// --- Contact Fields Validation ---

describe("BookingForm — field validation errors", () => {
  it("shows error when size is below 10", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    const sizeInput = screen.getByPlaceholderText("t.ex. 75");
    await user.type(sizeInput, "5");
    await user.tab();
    expect(await screen.findByText("Minst 10 kvm")).toBeInTheDocument();
  });

  it("shows error when size exceeds 500", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    const sizeInput = screen.getByPlaceholderText("t.ex. 75");
    await user.type(sizeInput, "600");
    await user.tab();
    expect(await screen.findByText("Max 500 kvm")).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    const emailInput = screen.getByPlaceholderText("erik@exempel.se");
    await user.type(emailInput, "not-an-email");
    await user.tab();
    expect(await screen.findByText("Ogiltig e-postadress")).toBeInTheDocument();
  });

  it("shows error for short name", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    const nameInput = screen.getByPlaceholderText("Erik Andersson");
    await user.type(nameInput, "A");
    await user.tab();
    expect(await screen.findByText("Minst 2 tecken")).toBeInTheDocument();
  });

  it("shows error for short phone number", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    const phoneInput = screen.getByPlaceholderText("070-123 45 67");
    await user.type(phoneInput, "123");
    await user.tab();
    expect(
      await screen.findByText("Ogiltigt telefonnummer"),
    ).toBeInTheDocument();
  });

  it("shows error for short address", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    const addressInput = screen.getByPlaceholderText(
      "Storgatan 1, 123 45 Växjö",
    );
    await user.type(addressInput, "AB");
    await user.tab();
    expect(
      await screen.findByText("Ange fullständig adress"),
    ).toBeInTheDocument();
  });

  it("shows error for invalid personnummer format", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    const pnrInput = screen.getByPlaceholderText("ÅÅMMDD-XXXX");
    await user.type(pnrInput, "12345");
    await user.tab();
    expect(await screen.findByText("Format: ÅÅMMDD-XXXX")).toBeInTheDocument();
  });

  it("shows error for correctly formatted but invalid personnummer", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);
    const pnrInput = screen.getByPlaceholderText("ÅÅMMDD-XXXX");
    await user.type(pnrInput, "000000-0000");
    await user.tab();
    expect(
      await screen.findByText("Ogiltigt personnummer"),
    ).toBeInTheDocument();
  });
});

// --- Form Submission ---

describe("BookingForm — submission", () => {
  it("shows error toast when submitting incomplete form", async () => {
    render(<BookingForm />);
    const form = document.querySelector("form")!;
    await act(async () => fireEvent.submit(form));
    expect(mockToastError).toHaveBeenCalledWith(
      "Formuläret är ofullständigt",
      expect.objectContaining({
        description: "Vänligen fyll i alla obligatoriska fält.",
      }),
    );
  });

  it("submit button shows Bekräfta bokning text", () => {
    render(<BookingForm />);
    expect(
      screen.getByRole("button", { name: /bekräfta bokning/i }),
    ).toBeInTheDocument();
  });
});
