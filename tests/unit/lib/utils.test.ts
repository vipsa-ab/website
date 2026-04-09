import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn() utility", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes (falsy values ignored)", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("resolves conflicting Tailwind color utilities", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("keeps non-conflicting Tailwind classes", () => {
    const result = cn("px-4", "py-2", "mt-4");
    expect(result).toBe("px-4 py-2 mt-4");
  });

  it("works with clsx array syntax", () => {
    const result = cn(["foo", "bar"], "baz");
    expect(result).toBe("foo bar baz");
  });

  it("works with clsx object syntax", () => {
    const result = cn({ hidden: true, visible: false });
    expect(result).toBe("hidden");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
