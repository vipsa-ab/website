import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

const NAV_LINKS = [
  { href: "/", label: "Hem" },
  { href: "/services", label: "Tjänster" },
  { href: "/about", label: "Om Oss" },
  { href: "/pricing", label: "Prislista" },
  { href: "/contact", label: "Kontakt" },
];

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Mark as mounted so the portal target (document.body) is available
  useEffect(() => {
    setMounted(true);
    setCurrentPath(window.location.pathname);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  // Scroll lock + focus trap + Escape key
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Move focus into the drawer
    const drawer = drawerRef.current;
    if (drawer) {
      const firstFocusable =
        drawer.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
      firstFocusable?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  const overlay = (
    <>
      {/* Backdrop — portaled to body so fixed covers the full viewport */}
      <div
        aria-hidden="true"
        onClick={close}
        className={[
          "bg-on-surface/30 fixed inset-0 z-50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Side Drawer — portaled to body */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobil navigationsmeny"
        className={[
          "bg-surface-container-lowest/90 fixed top-0 right-0 z-50 flex h-full w-72 flex-col shadow-xl backdrop-blur-[20px] transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Drawer header */}
        <div className="border-outline-variant/30 flex items-center justify-between border-b px-6 py-5">
          <span className="font-headline text-on-surface-variant text-sm font-semibold tracking-widest uppercase">
            Meny
          </span>
          <button
            onClick={close}
            aria-label="Stäng navigationsmeny"
            className="text-on-surface-variant hover:bg-secondary-fixed/40 hover:text-on-surface focus-visible:outline-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav
          aria-label="Huvudnavigering"
          className="flex flex-1 flex-col gap-1 px-4 py-6"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === "/" ? currentPath === "/" : currentPath.startsWith(href);

            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                onClick={close}
                className={[
                  "flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-150",
                  "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
                  isActive
                    ? "border-primary bg-secondary-fixed/40 text-primary border-l-2 pl-3.5 font-bold"
                    : "text-on-surface hover:border-primary/40 hover:bg-secondary-fixed/20 hover:text-primary transition-all hover:border-l-2 hover:pl-3.5",
                ].join(" ")}
              >
                {label}
              </a>
            );
          })}
        </nav>

        {/* CTA at bottom */}
        <div className="border-outline-variant/30 border-t px-6 py-6">
          <a
            href="/booking"
            onClick={close}
            className="signature-gradient focus-visible:outline-primary flex w-full items-center justify-center rounded-full px-6 py-3 font-bold text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Boka Nu
          </a>
        </div>
      </div>

      {/* Live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isOpen ? "Navigationsmenyn är öppen" : ""}
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger trigger — stays in the header island */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Öppna navigationsmeny"
        className="hover:bg-secondary-fixed/40 focus-visible:outline-primary text-on-surface-variant cursor-pointer rounded-lg p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
          />
        </svg>
      </button>

      {/* Portal: backdrop + drawer rendered directly into document.body */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
