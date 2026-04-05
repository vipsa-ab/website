// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileMenu from "@/components/ui/MobileMenu";

// createPortal renders into document.body in jsdom — no stub needed.
// requestAnimationFrame is unavailable in jsdom; stub it so focus-return logic runs.
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

describe("MobileMenu — hamburger trigger", () => {
  it("renders the hamburger button", () => {
    render(<MobileMenu />);
    expect(
      screen.getByRole("button", { name: /öppna navigationsmeny/i }),
    ).toBeInTheDocument();
  });

  it("has aria-expanded=false when closed", () => {
    render(<MobileMenu />);
    const btn = screen.getByRole("button", { name: /öppna navigationsmeny/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("has aria-controls pointing to mobile-menu", () => {
    render(<MobileMenu />);
    const btn = screen.getByRole("button", { name: /öppna navigationsmeny/i });
    expect(btn).toHaveAttribute("aria-controls", "mobile-menu");
  });

  it("opens the drawer when clicked", async () => {
    render(<MobileMenu />);
    const btn = screen.getByRole("button", { name: /öppna navigationsmeny/i });
    await act(async () => fireEvent.click(btn));
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
});

describe("MobileMenu — drawer ARIA attributes", () => {
  beforeEach(async () => {
    render(<MobileMenu />);
    const btn = screen.getByRole("button", { name: /öppna navigationsmeny/i });
    await act(async () => fireEvent.click(btn));
  });

  it("drawer has role=dialog", () => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("drawer has aria-modal=true", () => {
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("drawer has an accessible label", () => {
    expect(
      screen.getByRole("dialog", { name: /navigationsmeny/i }),
    ).toBeInTheDocument();
  });

  it("nav inside drawer has an accessible label", () => {
    expect(
      screen.getByRole("navigation", { name: /huvudnavigering/i }),
    ).toBeInTheDocument();
  });
});

describe("MobileMenu — navigation links", () => {
  beforeEach(async () => {
    render(<MobileMenu />);
    const btn = screen.getByRole("button", { name: /öppna navigationsmeny/i });
    await act(async () => fireEvent.click(btn));
  });

  it("renders all five nav links", () => {
    const nav = screen.getByRole("navigation", { name: /huvudnavigering/i });
    const links = nav.querySelectorAll("a");
    expect(links).toHaveLength(5);
  });

  it("renders link to Hem (/)", () => {
    expect(screen.getByRole("link", { name: "Hem" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders link to Tjänster (/services)", () => {
    expect(screen.getByRole("link", { name: "Tjänster" })).toHaveAttribute(
      "href",
      "/services",
    );
  });

  it("renders link to Om Oss (/about)", () => {
    expect(screen.getByRole("link", { name: "Om Oss" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("renders link to Prislista (/pricing)", () => {
    expect(screen.getByRole("link", { name: "Prislista" })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });

  it("renders link to Kontakt (/contact)", () => {
    expect(screen.getByRole("link", { name: "Kontakt" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("marks the active link with aria-current=page (defaults to / in jsdom)", () => {
    const hemLink = screen.getByRole("link", { name: "Hem" });
    expect(hemLink).toHaveAttribute("aria-current", "page");
  });

  it("other links do not have aria-current", () => {
    expect(screen.getByRole("link", { name: "Tjänster" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "Kontakt" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});

describe("MobileMenu — Boka Nu CTA", () => {
  beforeEach(async () => {
    render(<MobileMenu />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );
  });

  it("renders the Boka Nu link inside the drawer", () => {
    expect(screen.getByRole("link", { name: "Boka Nu" })).toHaveAttribute(
      "href",
      "/booking",
    );
  });

  it("Boka Nu link has signature-gradient class", () => {
    expect(screen.getByRole("link", { name: "Boka Nu" })).toHaveClass(
      "signature-gradient",
    );
  });
});

describe("MobileMenu — close interactions", () => {
  it("close button inside drawer closes the menu", async () => {
    render(<MobileMenu />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );
    const closeBtn = screen.getByRole("button", {
      name: /stäng navigationsmeny/i,
    });
    await act(async () => fireEvent.click(closeBtn));
    expect(
      screen.getByRole("button", { name: /öppna navigationsmeny/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("Escape key closes the drawer", async () => {
    render(<MobileMenu />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );
    await act(async () =>
      fireEvent.keyDown(document, { key: "Escape", code: "Escape" }),
    );
    expect(
      screen.getByRole("button", { name: /öppna navigationsmeny/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("clicking a nav link closes the drawer", async () => {
    render(<MobileMenu />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );
    await act(async () =>
      fireEvent.click(screen.getByRole("link", { name: "Tjänster" })),
    );
    expect(
      screen.getByRole("button", { name: /öppna navigationsmeny/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("clicking the backdrop closes the drawer", async () => {
    const { container } = render(<MobileMenu />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );
    // The backdrop has aria-hidden="true" and onClick handler
    const backdrop = container.ownerDocument.body.querySelector(
      '[aria-hidden="true"].fixed.inset-0',
    );
    expect(backdrop).not.toBeNull();
    await act(async () => fireEvent.click(backdrop!));
    expect(
      screen.getByRole("button", { name: /öppna navigationsmeny/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});

describe("MobileMenu — scroll lock", () => {
  it("locks body scroll when drawer is open", async () => {
    render(<MobileMenu />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when drawer is closed", async () => {
    render(<MobileMenu />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /stäng navigationsmeny/i }),
      ),
    );
    expect(document.body.style.overflow).toBe("");
  });
});

describe("MobileMenu — live region", () => {
  it("has a live region for screen reader announcements", () => {
    render(<MobileMenu />);
    const liveRegion = document.body.querySelector(
      '[role="status"][aria-live="polite"]',
    );
    expect(liveRegion).not.toBeNull();
  });

  it("live region announces open state", async () => {
    render(<MobileMenu />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );
    const liveRegion = document.body.querySelector(
      '[role="status"][aria-live="polite"]',
    );
    expect(liveRegion?.textContent).toContain("öppen");
  });
});

describe("MobileMenu — keyboard focus trap", () => {
  it("Tab key wraps focus from last to first focusable element", async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);

    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /öppna navigationsmeny/i }),
      ),
    );

    const drawer = screen.getByRole("dialog");
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    expect(focusable.length).toBeGreaterThan(1);

    // Focus the last focusable element
    focusable[focusable.length - 1].focus();
    expect(document.activeElement).toBe(focusable[focusable.length - 1]);

    // Tab should wrap to first
    await user.tab();
    expect(document.activeElement).toBe(focusable[0]);
  });
});
