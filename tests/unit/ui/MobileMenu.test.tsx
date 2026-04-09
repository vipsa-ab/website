// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileMenu from "@/components/ui/MobileMenu";

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

function openMenu() {
  const trigger = screen.getByRole("button", { name: /öppna/i });
  return act(async () => fireEvent.click(trigger));
}

function getTrigger() {
  return screen.getByRole("button", { name: /öppna/i });
}

describe("MobileMenu — open/close state", () => {
  it("starts closed (aria-expanded=false)", () => {
    render(<MobileMenu />);
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("opens when trigger is clicked (aria-expanded=true)", async () => {
    render(<MobileMenu />);
    await openMenu();
    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("closes when close button is clicked", async () => {
    render(<MobileMenu />);
    await openMenu();
    const closeBtn = screen.getByRole("button", { name: /stäng/i });
    await act(async () => fireEvent.click(closeBtn));
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when Escape key is pressed", async () => {
    render(<MobileMenu />);
    await openMenu();
    await act(async () =>
      fireEvent.keyDown(document, { key: "Escape", code: "Escape" }),
    );
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when a navigation link is clicked", async () => {
    render(<MobileMenu />);
    await openMenu();
    const links = screen.getAllByRole("link");
    await act(async () => fireEvent.click(links[0]));
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when the backdrop is clicked", async () => {
    render(<MobileMenu />);
    await openMenu();
    const backdrop = document.body.querySelector('[aria-hidden="true"]');
    expect(backdrop).not.toBeNull();
    await act(async () => fireEvent.click(backdrop!));
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
  });
});

describe("MobileMenu — scroll lock", () => {
  it("locks body scroll when open", async () => {
    render(<MobileMenu />);
    await openMenu();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when closed", async () => {
    render(<MobileMenu />);
    await openMenu();
    const closeBtn = screen.getByRole("button", { name: /stäng/i });
    await act(async () => fireEvent.click(closeBtn));
    expect(document.body.style.overflow).toBe("");
  });
});

describe("MobileMenu — accessibility", () => {
  it("opens a dialog with aria-modal when menu is active", async () => {
    render(<MobileMenu />);
    await openMenu();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("contains a navigation landmark inside the dialog", async () => {
    render(<MobileMenu />);
    await openMenu();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("marks the current-path link with aria-current=page", async () => {
    render(<MobileMenu />);
    await openMenu();
    const links = screen.getAllByRole("link");
    const currentLinks = links.filter((l) => l.hasAttribute("aria-current"));
    expect(currentLinks).toHaveLength(1);
    expect(currentLinks[0]).toHaveAttribute("aria-current", "page");
  });

  it("announces menu state via live region", async () => {
    render(<MobileMenu />);
    await openMenu();
    const liveRegion = document.body.querySelector(
      '[role="status"][aria-live="polite"]',
    );
    expect(liveRegion).not.toBeNull();
    expect(liveRegion!.textContent).not.toBe("");
  });
});

describe("MobileMenu — keyboard focus trap", () => {
  it("wraps focus from last to first focusable element on Tab", async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);
    await openMenu();

    const drawer = screen.getByRole("dialog");
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    expect(focusable.length).toBeGreaterThan(1);

    focusable[focusable.length - 1].focus();
    expect(document.activeElement).toBe(focusable[focusable.length - 1]);

    await user.tab();
    expect(document.activeElement).toBe(focusable[0]);
  });
});
