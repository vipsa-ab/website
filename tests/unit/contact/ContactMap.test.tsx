// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// vi.hoisted runs before vi.mock hoisting — safe to reference in factories
const {
  mockRemove,
  mockAddControl,
  mockMarkerSetLngLat,
  mockMarkerAddTo,
  MockMap,
  MockMarker,
  MockNavigationControl,
} = vi.hoisted(() => {
  const mockRemove = vi.fn();
  const mockAddControl = vi.fn();
  const mockMarkerSetLngLat = vi.fn().mockReturnThis();
  const mockMarkerAddTo = vi.fn().mockReturnThis();

  const MockMap = vi.fn().mockImplementation(function (this: any) {
    this.remove = mockRemove;
    this.addControl = mockAddControl;
  });

  const MockMarker = vi.fn().mockImplementation(function (this: any) {
    this.setLngLat = mockMarkerSetLngLat;
    this.addTo = mockMarkerAddTo;
  });

  const MockNavigationControl = vi.fn().mockImplementation(function () {});

  return {
    mockRemove,
    mockAddControl,
    mockMarkerSetLngLat,
    mockMarkerAddTo,
    MockMap,
    MockMarker,
    MockNavigationControl,
  };
});

vi.mock("maplibre-gl", () => ({
  default: {
    Map: MockMap,
    Marker: MockMarker,
    NavigationControl: MockNavigationControl,
  },
}));

vi.mock("maplibre-gl/dist/maplibre-gl.css", () => ({}));

vi.mock("~icons/material-symbols/location-on", () => ({
  default: (props: any) => <span data-testid="icon-location" {...props} />,
}));

import { ContactMap } from "@/components/contact/ContactMap";

beforeEach(() => {
  MockMap.mockClear();
  mockRemove.mockClear();
  mockAddControl.mockClear();
  MockMarker.mockClear();
  mockMarkerSetLngLat.mockClear();
  mockMarkerAddTo.mockClear();
  MockNavigationControl.mockClear();
});

// --- Rendering ---

describe("ContactMap — rendering", () => {
  it("renders the map container", () => {
    render(<ContactMap />);
    const container = document.querySelector(".h-full.w-full");
    expect(container).toBeInTheDocument();
  });

  it("renders the office info card", () => {
    render(<ContactMap />);
    expect(screen.getByText("Vårt huvudkontor")).toBeInTheDocument();
    expect(
      screen.getByText("Ormbergsvägen 15, 193 36 Sigtuna"),
    ).toBeInTheDocument();
  });
});

// --- Map Initialization ---

describe("ContactMap — map initialization", () => {
  it("creates a MapLibre map with correct config", () => {
    render(<ContactMap />);
    expect(MockMap).toHaveBeenCalledWith(
      expect.objectContaining({
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [17.7135502, 59.6224415],
        zoom: 15,
        attributionControl: false,
        cooperativeGestures: true,
      }),
    );
  });

  it("adds navigation control", () => {
    render(<ContactMap />);
    expect(MockNavigationControl).toHaveBeenCalled();
    expect(mockAddControl).toHaveBeenCalledWith(
      expect.any(Object),
      "top-right",
    );
  });

  it("adds marker at correct coordinates", () => {
    render(<ContactMap />);
    expect(MockMarker).toHaveBeenCalledWith(
      expect.objectContaining({ element: expect.any(HTMLDivElement) }),
    );
    expect(mockMarkerSetLngLat).toHaveBeenCalledWith([17.7135502, 59.6224415]);
    expect(mockMarkerAddTo).toHaveBeenCalled();
  });

  it("marker element has correct classes", () => {
    render(<ContactMap />);
    const markerCall = MockMarker.mock.calls[0][0];
    const el = markerCall.element as HTMLDivElement;
    expect(el.className).toContain("rounded-full");
    expect(el.className).toContain("bg-white");
    expect(el.className).toContain("shadow-xl");
  });

  it("does not create map twice on re-render", () => {
    const { rerender } = render(<ContactMap />);
    rerender(<ContactMap />);
    expect(MockMap).toHaveBeenCalledTimes(1);
  });
});

// --- Cleanup ---

describe("ContactMap — cleanup", () => {
  it("removes map on unmount", () => {
    render(<ContactMap />);
    cleanup();
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
