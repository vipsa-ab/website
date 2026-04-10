import { useState } from "react";

export const CalculatorSection = () => {
  const [frequency, setFrequency] = useState<"weekly" | "biweekly" | "monthly">(
    "biweekly",
  );
  const [squareMeters, setSquareMeters] = useState(75);

  const multiplier = {
    weekly: 0.9,
    biweekly: 1,
    monthly: 1.1,
  }[frequency];

  const price = Math.round((squareMeters / 36) * 390 * multiplier);
  return (
    <section className="bg-surface px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="font-headline mb-4 text-3xl font-extrabold md:text-4xl">
            Beräkna ditt pris
          </h2>
          <p className="text-on-surface-variant">
            Få en uppskattning direkt för din hemstädning.
          </p>
        </div>
        <div className="bg-surface-container-low border-outline-variant/30 rounded-2xl border p-8 shadow-sm md:p-12">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <div className="space-y-10">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <label
                    className="text-on-surface font-bold"
                    htmlFor="kvm-slider"
                  >
                    Boyta (kvm)
                  </label>
                  <span
                    className="bg-primary-fixed text-on-primary-fixed rounded-full px-3 py-1 text-sm font-bold"
                    id="kvm-display"
                  >
                    {squareMeters} kvm
                  </span>
                </div>
                <input
                  className="accent-primary"
                  id="kvm-slider"
                  max="300"
                  min="20"
                  step="5"
                  type="range"
                  value={squareMeters}
                  onChange={(e) => setSquareMeters(Number(e.target.value))}
                />
                <div className="text-on-surface-variant mt-2 flex justify-between text-xs font-medium">
                  <span>20 kvm</span>
                  <span>300 kvm</span>
                </div>
              </div>
              <fieldset>
                <legend className="text-on-surface mb-4 block font-bold">
                  Hur ofta vill du ha städat?
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label
                    className="border-outline-variant hover:border-primary/50 has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-center text-sm font-bold transition-all"
                    htmlFor="freq-monthly"
                  >
                    <input
                      className="sr-only"
                      id="freq-monthly"
                      name="frequency"
                      type="radio"
                      value="monthly"
                      checked={frequency === "monthly"}
                      onChange={() => setFrequency("monthly")}
                    />
                    Månatlig
                  </label>
                  <label
                    className="border-outline-variant hover:border-primary/50 has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-center text-sm font-bold transition-all"
                    htmlFor="freq-biweekly"
                  >
                    <input
                      className="sr-only"
                      id="freq-biweekly"
                      name="frequency"
                      type="radio"
                      value="biweekly"
                      checked={frequency === "biweekly"}
                      onChange={() => setFrequency("biweekly")}
                    />
                    Varannan vecka
                  </label>
                  <label
                    className="border-outline-variant hover:border-primary/50 has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-center text-sm font-bold transition-all"
                    htmlFor="freq-weekly"
                  >
                    <input
                      className="sr-only"
                      id="freq-weekly"
                      name="frequency"
                      type="radio"
                      value="weekly"
                      checked={frequency === "weekly"}
                      onChange={() => setFrequency("weekly")}
                    />
                    Varje vecka
                  </label>
                </div>
              </fieldset>
            </div>
            <div className="shadow-primary/5 border-primary/10 rounded-xl border bg-white p-8 shadow-xl">
              <div className="space-y-6">
                <div className="border-surface-variant flex items-center justify-between border-b pb-4">
                  <span className="text-on-surface-variant font-medium">
                    Pris före RUT-avdrag
                  </span>
                  <span className="text-lg font-bold" id="price-before">
                    {price * 2} kr
                  </span>
                </div>
                <div className="py-2">
                  <p className="text-primary mb-1 text-sm font-bold tracking-wider uppercase">
                    Ditt pris med RUT-avdrag
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-on-surface text-5xl font-extrabold"
                      id="price-after"
                    >
                      {price} kr
                    </span>
                    <span className="text-on-surface-variant font-semibold">
                      /tillfälle
                    </span>
                  </div>
                  <p className="text-on-surface-variant mt-2 text-xs">
                    Priset inkluderar moms och baseras på beräknad tidsåtgång.
                  </p>
                </div>
                <button className="signature-gradient shadow-primary/20 flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]">
                  Boka Nu
                  <svg
                    width="1em"
                    height="1em"
                    className="text-lg"
                    data-icon="material-symbols:arrow-forward"
                    data-astro-source-file="/Users/carfdev/Code/projects/vipsa/frontend/node_modules/.pnpm/astro-icon@1.1.5/node_modules/astro-icon/components/Icon.astro"
                    data-astro-source-loc="124:44"
                  >
                    {" "}
                    <symbol
                      id="ai:material-symbols:arrow-forward"
                      viewBox="0 0 24 24"
                      data-astro-source-file="/Users/carfdev/Code/projects/vipsa/frontend/node_modules/.pnpm/astro-icon@1.1.5/node_modules/astro-icon/components/Icon.astro"
                      data-astro-source-loc="132:28"
                    >
                      <path
                        fill="currentColor"
                        d="M16.175 13H4v-2h12.175l-5.6-5.6L12 4l8 8l-8 8l-1.425-1.4z"
                      ></path>
                    </symbol>
                    <use
                      href="#ai:material-symbols:arrow-forward"
                      data-astro-source-file="/Users/carfdev/Code/projects/vipsa/frontend/node_modules/.pnpm/astro-icon@1.1.5/node_modules/astro-icon/components/Icon.astro"
                      data-astro-source-loc="133:10"
                    ></use>{" "}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
