import "@testing-library/jest-dom";

// Supress "not wrapped in act(...)" warnings.
// This is extremely common with react-hook-form and mounting components with initial useEffects.
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("was not wrapped in act")
  ) {
    return;
  }
  originalConsoleError(...args);
};
