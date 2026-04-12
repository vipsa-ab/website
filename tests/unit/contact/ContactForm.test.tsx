// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

import { ContactForm } from "@/components/contact/ContactForm";

beforeEach(() => {
  mockToastSuccess.mockClear();
  mockToastError.mockClear();
});

// --- Rendering & Structure ---

describe("ContactForm — rendering", () => {
  it("renders the form heading", () => {
    render(<ContactForm />);
    expect(screen.getByText("Skicka ett meddelande")).toBeInTheDocument();
  });

  it("renders all input fields", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText("Ditt namn")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("namn@exempel.se")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("070-000 00 00")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Hur kan vi hjälpa dig?"),
    ).toBeInTheDocument();
  });

  it("renders the service select with all options", () => {
    render(<ContactForm />);
    const select = screen.getByLabelText("Typ av tjänst");
    const options = select.querySelectorAll("option");
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("Hemstädning");
    expect(options[1]).toHaveTextContent("Flyttstädning");
    expect(options[2]).toHaveTextContent("Kontorsstädning");
    expect(options[3]).toHaveTextContent("Annat");
  });

  it("renders the submit button", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /skicka förfrågan/i }),
    ).toBeInTheDocument();
  });

  it("renders all labels", () => {
    render(<ContactForm />);
    expect(screen.getByText("Namn")).toBeInTheDocument();
    expect(screen.getByText("E-post")).toBeInTheDocument();
    expect(screen.getByText("Telefon")).toBeInTheDocument();
    expect(screen.getByText("Typ av tjänst")).toBeInTheDocument();
    expect(screen.getByText("Meddelande")).toBeInTheDocument();
  });
});

// --- Default State ---

describe("ContactForm — default state", () => {
  it("submit button is disabled by default (form incomplete)", () => {
    render(<ContactForm />);
    const btn = screen.getByRole("button", { name: /skicka förfrågan/i });
    expect(btn).toBeDisabled();
  });

  it("defaults service select to Hemstädning", () => {
    render(<ContactForm />);
    const select = screen.getByLabelText("Typ av tjänst") as HTMLSelectElement;
    expect(select.value).toBe("Hemstädning");
  });

  it("all text inputs start empty", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText("Ditt namn")).toHaveValue("");
    expect(screen.getByPlaceholderText("namn@exempel.se")).toHaveValue("");
    expect(screen.getByPlaceholderText("070-000 00 00")).toHaveValue("");
    expect(screen.getByPlaceholderText("Hur kan vi hjälpa dig?")).toHaveValue(
      "",
    );
  });
});

// --- Field Validation ---

describe("ContactForm — field validation errors", () => {
  it("shows error for short name", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByPlaceholderText("Ditt namn"), "A");
    await user.tab();
    expect(await screen.findByText("Minst 2 tecken")).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByPlaceholderText("namn@exempel.se"), "bad");
    await user.tab();
    expect(await screen.findByText("Ogiltig e-postadress")).toBeInTheDocument();
  });

  it("shows error for short phone", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByPlaceholderText("070-000 00 00"), "123");
    await user.tab();
    expect(
      await screen.findByText("Ogiltigt telefonnummer"),
    ).toBeInTheDocument();
  });

  it("shows error for short message", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(
      screen.getByPlaceholderText("Hur kan vi hjälpa dig?"),
      "Hej",
    );
    await user.tab();
    expect(await screen.findByText("Minst 10 tecken")).toBeInTheDocument();
  });

  it("clears error when valid input is provided", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText("Ditt namn");
    await user.type(nameInput, "A");
    await user.tab();
    expect(await screen.findByText("Minst 2 tecken")).toBeInTheDocument();
    await user.clear(nameInput);
    await user.type(nameInput, "Erik Andersson");
    await user.tab();
    expect(screen.queryByText("Minst 2 tecken")).not.toBeInTheDocument();
  });
});

// --- Button State ---

describe("ContactForm — submit button state", () => {
  it("enables button when all fields are valid", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Ditt namn"), "Erik Andersson");
    await user.type(
      screen.getByPlaceholderText("namn@exempel.se"),
      "erik@test.se",
    );
    await user.type(screen.getByPlaceholderText("070-000 00 00"), "0701234567");
    await user.type(
      screen.getByPlaceholderText("Hur kan vi hjälpa dig?"),
      "Jag behöver hjälp med städning",
    );

    const btn = screen.getByRole("button", { name: /skicka förfrågan/i });
    expect(btn).toBeEnabled();
  });

  it("disables button when a field becomes invalid", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Ditt namn"), "Erik Andersson");
    await user.type(
      screen.getByPlaceholderText("namn@exempel.se"),
      "erik@test.se",
    );
    await user.type(screen.getByPlaceholderText("070-000 00 00"), "0701234567");
    await user.type(
      screen.getByPlaceholderText("Hur kan vi hjälpa dig?"),
      "Jag behöver hjälp med städning",
    );

    const btn = screen.getByRole("button", { name: /skicka förfrågan/i });
    expect(btn).toBeEnabled();

    // Clear name to make form invalid
    await user.clear(screen.getByPlaceholderText("Ditt namn"));
    await user.tab();
    expect(btn).toBeDisabled();
  });
});

// --- Form Submission ---

describe("ContactForm — submission", () => {
  it("shows error toast when submitting incomplete form", async () => {
    render(<ContactForm />);
    const form = document.querySelector("form")!;
    await act(async () => fireEvent.submit(form));
    expect(mockToastError).toHaveBeenCalledWith(
      "Formuläret är ofullständigt",
      expect.objectContaining({
        description: "Vänligen fyll i alla obligatoriska fält.",
      }),
    );
  });

  it("calls console.log and success toast on valid submit", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Ditt namn"), "Erik Andersson");
    await user.type(
      screen.getByPlaceholderText("namn@exempel.se"),
      "erik@test.se",
    );
    await user.type(screen.getByPlaceholderText("070-000 00 00"), "0701234567");
    await user.type(
      screen.getByPlaceholderText("Hur kan vi hjälpa dig?"),
      "Jag behöver hjälp med städning",
    );

    const btn = screen.getByRole("button", { name: /skicka förfrågan/i });
    await user.click(btn);

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Contact form submitted:",
        expect.objectContaining({
          name: "Erik Andersson",
          email: "erik@test.se",
          phone: "0701234567",
          service: "Hemstädning",
          message: "Jag behöver hjälp med städning",
        }),
      );
    });

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Meddelande skickat!",
      expect.objectContaining({
        description: "Vi återkommer så snart som möjligt.",
      }),
    );

    consoleSpy.mockRestore();
  });

  it("shows Skickar... text while submitting", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Ditt namn"), "Erik Andersson");
    await user.type(
      screen.getByPlaceholderText("namn@exempel.se"),
      "erik@test.se",
    );
    await user.type(screen.getByPlaceholderText("070-000 00 00"), "0701234567");
    await user.type(
      screen.getByPlaceholderText("Hur kan vi hjälpa dig?"),
      "Jag behöver hjälp med städning",
    );

    const btn = screen.getByRole("button", { name: /skicka förfrågan/i });
    // Don't await — we want to catch the intermediate state
    void user.click(btn);

    expect(await screen.findByText("Skickar...")).toBeInTheDocument();
  });
});

// --- Service Select ---

describe("ContactForm — service select", () => {
  it("allows changing service selection", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const select = screen.getByLabelText("Typ av tjänst") as HTMLSelectElement;
    await user.selectOptions(select, "Flyttstädning");
    expect(select.value).toBe("Flyttstädning");
  });

  it("submits with selected service", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<ContactForm />);

    await user.selectOptions(
      screen.getByLabelText("Typ av tjänst"),
      "Kontorsstädning",
    );
    await user.type(screen.getByPlaceholderText("Ditt namn"), "Erik Andersson");
    await user.type(
      screen.getByPlaceholderText("namn@exempel.se"),
      "erik@test.se",
    );
    await user.type(screen.getByPlaceholderText("070-000 00 00"), "0701234567");
    await user.type(
      screen.getByPlaceholderText("Hur kan vi hjälpa dig?"),
      "Jag behöver hjälp med städning",
    );

    await user.click(screen.getByRole("button", { name: /skicka förfrågan/i }));

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Contact form submitted:",
        expect.objectContaining({ service: "Kontorsstädning" }),
      );
    });

    consoleSpy.mockRestore();
  });
});
