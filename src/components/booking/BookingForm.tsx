import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import Personnummer from "personnummer";
import { DayPicker } from "react-day-picker";
import { addDays, format, startOfMonth, addMonths, subMonths } from "date-fns";
import { sv } from "date-fns/locale";
import { toast, Toaster } from "sonner";

import HomeIcon from "~icons/material-symbols/home";
import LocalShippingIcon from "~icons/material-symbols/local-shipping";
import CorporateFareIcon from "~icons/material-symbols/corporate-fare";
import CleaningServiceIcon from "~icons/material-symbols/cleaning-services";
import ConstructionIcon from "~icons/material-symbols/construction";
import ApartmentIcon from "~icons/material-symbols/apartment";
import ChevronLeftIcon from "~icons/material-symbols/chevron-left";
import ChevronRightIcon from "~icons/material-symbols/chevron-right";
import ScheduleIcon from "~icons/material-symbols/schedule";
import CheckCircleIcon from "~icons/material-symbols/check-circle";
import NightlightIcon from "~icons/material-symbols/nightlight";
import VerifiedUserIcon from "~icons/material-symbols/verified-user";
import LockOpenIcon from "~icons/material-symbols/lock-open";
import EcoIcon from "~icons/material-symbols/eco";
import AddCircleIcon from "~icons/material-symbols/add-circle";
import IronIcon from "~icons/material-symbols/iron";
import WindowIcon from "~icons/material-symbols/window";

// --- Types & Constants ---

enum Service {
  HOME = "home",
  MOVING = "moving",
  DEEP = "deep",
  CONSTRUCTION = "construction",
  OFFICE = "office",
  STAIRS = "stairs",
}

const SERVICES = [
  {
    value: Service.HOME,
    label: "Hemstädning",
    desc: "Regelbunden städning för ett skinande hem.",
    icon: HomeIcon,
  },
  {
    value: Service.MOVING,
    label: "Flyttstädning",
    desc: "Grundlig rengöring inför din flytt.",
    icon: LocalShippingIcon,
  },
  {
    value: Service.DEEP,
    label: "Storstädning",
    desc: "Extra djuprengöring av alla ytor.",
    icon: CleaningServiceIcon,
  },
  {
    value: Service.CONSTRUCTION,
    label: "Byggstädning",
    desc: "Effektiv städning efter renovering.",
    icon: ConstructionIcon,
  },
  {
    value: Service.OFFICE,
    label: "Kontorsstädning",
    desc: "Professionell miljö för dina anställda.",
    icon: CorporateFareIcon,
  },
  {
    value: Service.STAIRS,
    label: "Trappstädning",
    desc: "Rena och inbjudande trapphus.",
    icon: ApartmentIcon,
  },
];

const FREQUENCY_OPTIONS = [
  { value: "weekly" as const, label: "Varje vecka", id: "freq-weekly" },
  { value: "biweekly" as const, label: "Varannan vecka", id: "freq-biweekly" },
  { value: "monthly" as const, label: "Månatlig", id: "freq-monthly" },
];

const FREQUENCY_DISCOUNT: Record<string, number> = {
  weekly: 0.1,
  biweekly: 0.05,
  monthly: 0,
};

const PRICE_PER_HOUR: Record<string, number> = {
  [Service.HOME]: 480,
  [Service.MOVING]: 495,
  [Service.OFFICE]: 420,
  [Service.STAIRS]: 395,
  [Service.DEEP]: 550,
  [Service.CONSTRUCTION]: 625,
};

const HOURS_PER_SQM: Record<string, number> = {
  [Service.HOME]: 0.05,
  [Service.MOVING]: 0.15,
  [Service.OFFICE]: 0.04,
  [Service.STAIRS]: 0.03,
  [Service.DEEP]: 0.12,
  [Service.CONSTRUCTION]: 0.2,
};

const SERVICE_FEE = 49;

const MIN_HOURS = 2;

const MOVING_MIN_BEFORE_RUT = 2980;

const MOMS_RATE = 0.25;

const B2B_SERVICES: Service[] = [Service.OFFICE, Service.STAIRS];

const DUAL_SERVICES: Service[] = [Service.CONSTRUCTION];

const isBusinessCustomer = (
  service: string,
  customerType: string | undefined,
): boolean => {
  if (B2B_SERVICES.includes(service as Service)) return true;
  if (DUAL_SERVICES.includes(service as Service) && customerType === "business")
    return true;
  return false;
};

const validateOrganisationsnummer = (value: string): boolean => {
  const cleaned = value.replace(/-/g, "");
  if (!/^\d{10}$/.test(cleaned)) return false;
  if (parseInt(cleaned[2], 10) < 2) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let digit = parseInt(cleaned[i], 10);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

const RECURRING_SERVICES: Service[] = [
  Service.HOME,
  Service.OFFICE,
  Service.STAIRS,
];

// --- Addons ---

type Addon = "ironing" | "windows";

const ADDONS_BY_SERVICE: Partial<Record<Service, Addon[]>> = {
  [Service.HOME]: ["ironing", "windows"],
  [Service.DEEP]: ["windows"],
  [Service.CONSTRUCTION]: ["windows"],
  [Service.OFFICE]: ["windows"],
  [Service.STAIRS]: ["windows"],
};

const ADDON_INFO: Record<
  Addon,
  { label: string; desc: string; pricePerHour: number; icon: typeof IronIcon }
> = {
  ironing: {
    label: "Strykning",
    desc: "Vi stryker dina kläder och textilier på plats.",
    pricePerHour: 450,
    icon: IronIcon,
  },
  windows: {
    label: "Fönsterputs",
    desc: "Vi putsar dina fönster invändigt för kristallklar sikt.",
    pricePerHour: 390,
    icon: WindowIcon,
  },
};

// --- Mock Availability Data (simulates backend response) ---

const today = new Date();
today.setHours(0, 0, 0, 0);

const MOCK_AVAILABILITY: Record<string, string[]> = (() => {
  const result: Record<string, string[]> = {};
  for (let i = 2; i <= 60; i++) {
    const date = addDays(today, i);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    const key = format(date, "yyyy-MM-dd");
    const slots: string[] = [];
    if (i % 3 !== 0) slots.push("08:00 - 12:00");
    if (i % 5 !== 1) slots.push("13:00 - 17:00");
    if (i % 4 !== 2) slots.push("Kvällstid (från 18:00)");

    if (slots.length > 0) result[key] = slots;
  }
  return result;
})();

// --- Zod Schema ---

const bookingSchema = z
  .object({
    service: z.enum([
      "home",
      "moving",
      "deep",
      "construction",
      "office",
      "stairs",
    ]),
    size: z
      .number({ error: "Ange storlek i kvm" })
      .min(10, "Minst 10 kvm")
      .max(500, "Max 500 kvm"),
    rooms: z.number().min(1).max(5),
    frequency: z.enum(["weekly", "biweekly", "monthly"]),
    hours: z
      .number()
      .min(MIN_HOURS, `Minst ${MIN_HOURS} timmar`)
      .max(40, "Max 40 timmar")
      .optional(),
    autoHours: z.boolean().optional(),
    date: z.date({ error: "Välj ett datum" }),
    timeSlot: z.string().min(1, "Välj en tid"),
    name: z.string().min(2, "Minst 2 tecken"),
    email: z.string().email("Ogiltig e-postadress"),
    phone: z.string().min(7, "Ogiltigt telefonnummer"),
    customerType: z.enum(["private", "business"]).optional(),
    personalNumber: z.string().optional(),
    organisationNumber: z.string().optional(),
    address: z.string().min(5, "Ange fullständig adress"),
    addons: z.object({
      ironing: z.object({
        enabled: z.boolean(),
        hours: z.number().min(1).max(4),
      }),
      windows: z.object({
        enabled: z.boolean(),
        hours: z.number().min(1).max(4),
      }),
    }),
  })
  .superRefine((data, ctx) => {
    if (
      !data.autoHours &&
      (data.hours === undefined || data.hours < MIN_HOURS)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["hours"],
        message: `Minst ${MIN_HOURS} timmar`,
      });
    }

    const isB2B = isBusinessCustomer(data.service, data.customerType);

    if (isB2B) {
      const value = data.organisationNumber ?? "";
      if (!/^\d{6}-\d{4}$/.test(value)) {
        ctx.addIssue({
          code: "custom",
          path: ["organisationNumber"],
          message: "Format: XXXXXX-XXXX",
        });
      } else if (!validateOrganisationsnummer(value)) {
        ctx.addIssue({
          code: "custom",
          path: ["organisationNumber"],
          message: "Ogiltigt organisationsnummer",
        });
      }
    } else {
      const value = data.personalNumber ?? "";
      if (!/^\d{6}-\d{4}$/.test(value)) {
        ctx.addIssue({
          code: "custom",
          path: ["personalNumber"],
          message: "Format: ÅÅMMDD-XXXX",
        });
      } else if (!Personnummer.valid(value)) {
        ctx.addIssue({
          code: "custom",
          path: ["personalNumber"],
          message: "Ogiltigt personnummer",
        });
      }
    }
  });

type BookingFormData = z.infer<typeof bookingSchema>;

// --- Swedish month names ---

const SV_MONTHS = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

// --- Component ---

export const BookingForm = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() =>
    startOfMonth(addDays(today, 2)),
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      service: Service.HOME,
      rooms: 1,
      frequency: "weekly",
      autoHours: true,
      hours: MIN_HOURS,
      customerType: "private",
      addons: {
        ironing: { enabled: false, hours: 1 },
        windows: { enabled: false, hours: 1 },
      },
    },
  });

  const watchedService = watch("service");
  const watchedSize = watch("size");
  const watchedFrequency = watch("frequency");
  const watchedHours = watch("hours");
  const watchedAutoHours = watch("autoHours");
  const watchedDate = watch("date");
  const watchedTimeSlot = watch("timeSlot");
  const watchedAddons = watch("addons");
  const watchedCustomerType = watch("customerType");

  const availableAddons = ADDONS_BY_SERVICE[watchedService as Service] ?? [];
  const isDualService = DUAL_SERVICES.includes(watchedService as Service);
  const isB2B = isBusinessCustomer(watchedService, watchedCustomerType);
  const isRecurring = RECURRING_SERVICES.includes(watchedService as Service);
  const isMoving = watchedService === Service.MOVING;

  // Auto-calculated hours from size (fallback when user doesn't know)
  const autoCalculatedHours = useMemo(() => {
    const size = Number(watchedSize) || 0;
    const rate = HOURS_PER_SQM[watchedService] ?? 0.05;
    const raw = size * rate;
    return Math.max(MIN_HOURS, Math.round(raw * 2) / 2);
  }, [watchedSize, watchedService]);

  // Effective hours — either user-entered or auto-calculated
  const effectiveHours = useMemo(() => {
    if (watchedAutoHours) return autoCalculatedHours;
    const userHours = Number(watchedHours) || 0;
    return userHours >= MIN_HOURS ? userHours : autoCalculatedHours;
  }, [watchedAutoHours, watchedHours, autoCalculatedHours]);

  // Keep `hours` field in sync with auto-calc when autoHours is on
  useEffect(() => {
    if (watchedAutoHours) {
      setValue("hours", autoCalculatedHours, { shouldValidate: true });
    }
  }, [watchedAutoHours, autoCalculatedHours, setValue]);

  // Dynamic price calculation (hours-based)
  const pricing = useMemo(() => {
    const hourlyRate = PRICE_PER_HOUR[watchedService] ?? 480;
    const base = Math.round(effectiveHours * hourlyRate);
    const discountPct = isRecurring
      ? (FREQUENCY_DISCOUNT[watchedFrequency] ?? 0)
      : 0;
    const discount = Math.round(base * discountPct);
    const addonCost = availableAddons.reduce((sum, addon) => {
      const state = watchedAddons?.[addon];
      if (!state?.enabled) return sum;
      return sum + ADDON_INFO[addon].pricePerHour * (Number(state.hours) || 1);
    }, 0);
    const rawSubtotal = base - discount + SERVICE_FEE + addonCost;
    const subtotal = isMoving
      ? Math.max(rawSubtotal, MOVING_MIN_BEFORE_RUT)
      : rawSubtotal;
    const movingFloorApplied = isMoving && rawSubtotal < MOVING_MIN_BEFORE_RUT;
    const afterRut = isB2B ? null : Math.round(subtotal * 0.5);
    const exMoms = isB2B ? Math.round(subtotal / (1 + MOMS_RATE)) : null;
    return {
      base,
      discount,
      discountPct,
      addonCost,
      subtotal,
      afterRut,
      exMoms,
      hourlyRate,
      movingFloorApplied,
    };
  }, [
    watchedService,
    watchedFrequency,
    watchedAddons,
    availableAddons,
    isB2B,
    isRecurring,
    isMoving,
    effectiveHours,
  ]);

  // Available time slots for the selected date
  const availableSlots = useMemo(() => {
    if (!watchedDate) return [];
    const key = format(watchedDate, "yyyy-MM-dd");
    return MOCK_AVAILABILITY[key] ?? [];
  }, [watchedDate]);

  const onSubmit = async (data: BookingFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Booking submitted:", data);
    toast.success("Bokning bekräftad!", {
      description: `Städning bokad ${format(data.date, "d MMMM yyyy", { locale: sv })} kl. ${data.timeSlot}.`,
    });
  };

  const onError = () => {
    toast.error("Formuläret är ofullständigt", {
      description: "Vänligen fyll i alla obligatoriska fält.",
    });
  };

  const slotIcon = (slot: string) => {
    if (slot.includes("18")) return <NightlightIcon className="size-5" />;
    return <ScheduleIcon className="size-5" />;
  };

  const serviceLabel =
    SERVICES.find((s) => s.value === watchedService)?.label ?? "Hemstädning";
  const freqLabel =
    FREQUENCY_OPTIONS.find((f) => f.value === watchedFrequency)?.label ?? "";
  const hasSize = Number(watchedSize) >= 10;

  const hoursLabel = Number.isInteger(effectiveHours)
    ? `${effectiveHours}`
    : effectiveHours.toString().replace(".", ",");

  return (
    <>
      <Toaster richColors position="top-right" />
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="container mx-auto my-20 grid grid-cols-1 items-start gap-12 lg:grid-cols-12"
      >
        <div className="space-y-12 lg:col-span-8">
          {/* Section 1: Service */}
          <section className="bg-surface-container-lowest border-surface-variant/50 rounded-xl border p-8 shadow-sm md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <span className="signature-gradient text-on-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                1
              </span>
              <h2 className="font-headline text-2xl font-bold tracking-tight">
                Välj Tjänst
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map(({ value, label, desc, icon: Icon }) => (
                <label
                  key={value}
                  className={`hover:border-primary-container bg-surface-container-low relative flex cursor-pointer flex-col rounded-lg border-2 p-5 transition-all ${
                    watchedService === value
                      ? "border-primary-container"
                      : "border-transparent"
                  }`}
                >
                  <input
                    className="absolute opacity-0"
                    type="radio"
                    value={value}
                    {...register("service")}
                  />
                  <Icon className="text-primary mb-3 size-8" />
                  <span className="text-lg font-bold">{label}</span>
                  <span className="text-on-surface-variant text-sm">
                    {desc}
                  </span>
                </label>
              ))}
            </div>
            {availableAddons.length > 0 && (
              <div className="border-surface-variant/30 mt-10 border-t pt-8">
                <h3 className="font-headline mb-6 flex items-center gap-2 text-lg font-bold">
                  <AddCircleIcon className="text-primary size-6" />
                  Tilläggstjänster
                </h3>
                <div className="space-y-4">
                  {availableAddons.map((addon) => {
                    const info = ADDON_INFO[addon];
                    const AddonIcon = info.icon;
                    const enabled = watchedAddons?.[addon]?.enabled ?? false;
                    const enabledId = `addon-${addon}-enabled`;
                    const hoursId = `addon-${addon}-hours`;
                    return (
                      <div
                        key={addon}
                        className="bg-surface flex flex-col justify-between gap-6 rounded-lg p-6 md:flex-row md:items-center"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            className="border-outline-variant text-primary focus:ring-primary-container h-6 w-6 rounded transition-all"
                            id={enabledId}
                            type="checkbox"
                            {...register(`addons.${addon}.enabled`)}
                          />
                          <label
                            htmlFor={enabledId}
                            className="flex cursor-pointer flex-col"
                          >
                            <span className="text-on-surface flex items-center gap-2 font-bold">
                              <AddonIcon className="text-primary size-5" />
                              {info.label}
                            </span>
                            <span className="text-on-surface-variant text-sm">
                              {info.desc}
                            </span>
                            <span className="text-primary mt-1 text-xs font-semibold">
                              {isB2B
                                ? Math.round(
                                    info.pricePerHour / (1 + MOMS_RATE),
                                  )
                                : Math.round(info.pricePerHour * 0.5)}{" "}
                              kr / timme{" "}
                              <span className="text-on-surface-variant font-normal">
                                ({isB2B ? "exkl. moms" : "efter RUT"})
                              </span>
                            </span>
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <label
                            htmlFor={hoursId}
                            className="text-on-surface-variant text-sm font-semibold"
                          >
                            Antal timmar:
                          </label>
                          <select
                            id={hoursId}
                            disabled={!enabled}
                            className="bg-surface-container-lowest border-outline-variant focus:ring-primary-container rounded-lg border px-4 py-2 pr-8 font-semibold transition-all outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register(`addons.${addon}.hours`, {
                              valueAsNumber: true,
                            })}
                          >
                            <option value={1}>1 timme</option>
                            <option value={2}>2 timmar</option>
                            <option value={3}>3 timmar</option>
                            <option value={4}>4 timmar</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Housing Info */}
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <span className="signature-gradient text-on-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                2
              </span>
              <h2 className="font-headline text-2xl font-bold tracking-tight">
                Bostadsinformation
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  className="ml-1 block text-sm font-semibold"
                  htmlFor="size"
                >
                  Storlek (kvm)
                </label>
                <input
                  id="size"
                  className={`bg-surface-container-low w-full rounded-lg border-none px-4 py-3 transition-all outline-none focus:ring-2 ${
                    errors.size
                      ? "ring-2 ring-red-400"
                      : "focus:ring-primary-container"
                  }`}
                  placeholder="t.ex. 75"
                  type="number"
                  {...register("size", { valueAsNumber: true })}
                />
                {errors.size && (
                  <p className="ml-1 text-xs text-red-500">
                    {errors.size.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className="ml-1 block text-sm font-semibold"
                  htmlFor="room"
                >
                  Antal rum
                </label>
                <select
                  id="room"
                  className="bg-surface-container-low focus:ring-primary-container w-full rounded-lg border-none px-4 py-3 transition-all outline-none focus:ring-2"
                  {...register("rooms", { valueAsNumber: true })}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                      {n === 5 ? "+" : ""} rum
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="ml-1 block text-sm font-semibold"
                  htmlFor="hours"
                >
                  Antal timmar
                  {isMoving && (
                    <span className="text-on-surface-variant ml-2 text-xs font-normal">
                      (minimum: {MOVING_MIN_BEFORE_RUT} kr före RUT)
                    </span>
                  )}
                </label>
                <input
                  id="hours"
                  className={`bg-surface-container-low w-full rounded-lg border-none px-4 py-3 transition-all outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.hours
                      ? "ring-2 ring-red-400"
                      : "focus:ring-primary-container"
                  }`}
                  placeholder={`t.ex. ${MIN_HOURS}`}
                  type="number"
                  min={MIN_HOURS}
                  max={40}
                  step={0.5}
                  readOnly={watchedAutoHours}
                  {...register("hours", { valueAsNumber: true })}
                />
                {errors.hours && !watchedAutoHours && (
                  <p className="ml-1 text-xs text-red-500">
                    {errors.hours.message}
                  </p>
                )}
                <label
                  htmlFor="auto-hours"
                  className="ml-1 flex cursor-pointer items-center gap-2 pt-2 text-sm"
                >
                  <input
                    id="auto-hours"
                    type="checkbox"
                    className="border-outline-variant text-primary focus:ring-primary-container h-4 w-4 rounded"
                    {...register("autoHours")}
                  />
                  <span className="text-on-surface-variant">
                    Jag vet inte — beräkna utifrån storlek
                  </span>
                </label>
              </div>
              {isRecurring && (
                <fieldset className="space-y-2 md:col-span-3">
                  <legend className="mb-4 ml-1 block text-sm font-semibold">
                    Frekvens
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {FREQUENCY_OPTIONS.map(({ value, label, id }) => (
                      <label
                        key={value}
                        htmlFor={id}
                        className={`border-outline-variant flex cursor-pointer items-center justify-center rounded-full border-2 px-4 py-3 text-center text-sm font-bold transition-all ${
                          watchedFrequency === value
                            ? "border-primary bg-primary/5 text-primary"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <input
                          className="sr-only"
                          id={id}
                          type="radio"
                          value={value}
                          {...register("frequency")}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>
          </section>

          {/* Section 3: Calendar & Time */}
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <span className="signature-gradient text-on-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                3
              </span>
              <h2 className="font-headline text-2xl font-bold tracking-tight">
                Kalender &amp; Tid
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="bg-surface rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-bold">
                    {SV_MONTHS[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonth(subMonths(currentMonth, 1))
                      }
                      className="hover:bg-surface-container rounded-full p-1 transition-all"
                      aria-label="Föregående månad"
                    >
                      <ChevronLeftIcon className="size-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonth(addMonths(currentMonth, 1))
                      }
                      className="hover:bg-surface-container rounded-full p-1 transition-all"
                      aria-label="Nästa månad"
                    >
                      <ChevronRightIcon className="size-6" />
                    </button>
                  </div>
                </div>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DayPicker
                      mode="single"
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      selected={field.value}
                      onSelect={(date) => {
                        if (!date) return;
                        field.onChange(date);
                        setValue("timeSlot", "", { shouldValidate: true });
                      }}
                      locale={sv}
                      disabled={[
                        { before: addDays(today, 1) },
                        (date: Date) => {
                          const key = format(date, "yyyy-MM-dd");
                          return !MOCK_AVAILABILITY[key];
                        },
                      ]}
                      classNames={{
                        month_caption: "hidden",
                        nav: "hidden",
                        month_grid: "w-full",
                        weekdays: "grid grid-cols-7 gap-1 mb-3",
                        weekday:
                          "text-center text-xs font-bold text-on-surface-variant uppercase py-1",
                        weeks: "space-y-1",
                        week: "grid grid-cols-7 gap-1",
                        day: "flex items-center justify-center",
                        day_button:
                          "w-9 h-9 rounded-full text-sm font-medium transition-all cursor-pointer hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30",
                        selected:
                          "[&_button]:bg-primary-container [&_button]:text-on-primary [&_button]:font-bold [&_button]:hover:bg-primary-container",
                        today:
                          "[&_button]:text-primary [&_button]:font-bold [&_button]:ring-1 [&_button]:ring-primary/40",
                        outside: "opacity-30",
                        disabled: "opacity-30 pointer-events-none",
                        hidden: "invisible",
                      }}
                    />
                  )}
                />
                {errors.date && (
                  <p className="mt-3 text-center text-xs text-red-500">
                    Välj ett tillgängligt datum
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold">
                  {watchedDate
                    ? `Lediga tider den ${format(watchedDate, "d MMMM", { locale: sv })}`
                    : "Välj ett datum för att se tider"}
                </h3>
                {watchedDate && availableSlots.length > 0
                  ? availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setValue("timeSlot", slot, { shouldValidate: true })
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all ${
                          watchedTimeSlot === slot
                            ? "bg-primary-container text-on-primary"
                            : "bg-surface-container-low hover:bg-primary-container hover:text-on-primary"
                        }`}
                      >
                        <span>{slot}</span>
                        {watchedTimeSlot === slot ? (
                          <CheckCircleIcon className="size-5" />
                        ) : (
                          slotIcon(slot)
                        )}
                      </button>
                    ))
                  : watchedDate && (
                      <p className="text-on-surface-variant text-sm italic">
                        Inga lediga tider detta datum.
                      </p>
                    )}
                {errors.timeSlot && watchedDate && (
                  <p className="text-xs text-red-500">
                    {errors.timeSlot.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 4: Contact Info */}
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <span className="signature-gradient text-on-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                4
              </span>
              <h2 className="font-headline text-2xl font-bold tracking-tight">
                Kontaktuppgifter
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-on-surface-variant text-xs font-bold tracking-widest uppercase"
                >
                  Fullständigt Namn
                </label>
                <input
                  id="name"
                  className={`bg-surface-container-low w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-2 ${
                    errors.name
                      ? "ring-2 ring-red-400"
                      : "focus:ring-primary-container"
                  }`}
                  placeholder="Erik Andersson"
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-on-surface-variant text-xs font-bold tracking-widest uppercase"
                >
                  E-postadress
                </label>
                <input
                  id="email"
                  className={`bg-surface-container-low w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-2 ${
                    errors.email
                      ? "ring-2 ring-red-400"
                      : "focus:ring-primary-container"
                  }`}
                  placeholder="erik@exempel.se"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              {isDualService && (
                <fieldset className="space-y-2 md:col-span-2">
                  <legend className="text-on-surface-variant mb-3 text-xs font-bold tracking-widest uppercase">
                    Typ av kund
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(
                      [
                        { value: "private", label: "Privatperson (RUT)" },
                        { value: "business", label: "Företag" },
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt.value}
                        htmlFor={`customer-${opt.value}`}
                        className={`border-outline-variant flex cursor-pointer items-center justify-center rounded-full border-2 px-4 py-3 text-center text-sm font-bold transition-all ${
                          watchedCustomerType === opt.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <input
                          className="sr-only"
                          id={`customer-${opt.value}`}
                          type="radio"
                          value={opt.value}
                          {...register("customerType")}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <div className="space-y-1">
                <label
                  htmlFor="phone"
                  className="text-on-surface-variant text-xs font-bold tracking-widest uppercase"
                >
                  Telefonnummer
                </label>
                <input
                  id="phone"
                  className={`bg-surface-container-low w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-2 ${
                    errors.phone
                      ? "ring-2 ring-red-400"
                      : "focus:ring-primary-container"
                  }`}
                  placeholder="070-123 45 67"
                  type="tel"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {isB2B ? (
                <div className="space-y-1">
                  <label
                    htmlFor="identification"
                    className="text-on-surface-variant text-xs font-bold tracking-widest uppercase"
                  >
                    Organisationsnummer
                  </label>
                  <input
                    id="identification"
                    className={`bg-surface-container-low w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-2 ${
                      errors.organisationNumber
                        ? "ring-2 ring-red-400"
                        : "focus:ring-primary-container"
                    }`}
                    placeholder="XXXXXX-XXXX"
                    type="text"
                    {...register("organisationNumber")}
                  />
                  {errors.organisationNumber && (
                    <p className="text-xs text-red-500">
                      {errors.organisationNumber.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <label
                    htmlFor="identification"
                    className="text-on-surface-variant text-xs font-bold tracking-widest uppercase"
                  >
                    Personnummer (för RUT)
                  </label>
                  <input
                    id="identification"
                    className={`bg-surface-container-low w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-2 ${
                      errors.personalNumber
                        ? "ring-2 ring-red-400"
                        : "focus:ring-primary-container"
                    }`}
                    placeholder="ÅÅMMDD-XXXX"
                    type="text"
                    {...register("personalNumber")}
                  />
                  {errors.personalNumber && (
                    <p className="text-xs text-red-500">
                      {errors.personalNumber.message}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-1 md:col-span-2">
                <label
                  htmlFor="address"
                  className="text-on-surface-variant text-xs font-bold tracking-widest uppercase"
                >
                  Gatuadress &amp; Postnummer
                </label>
                <input
                  id="address"
                  className={`bg-surface-container-low w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-2 ${
                    errors.address
                      ? "ring-2 ring-red-400"
                      : "focus:ring-primary-container"
                  }`}
                  placeholder="Storgatan 1, 123 45 Växjö"
                  type="text"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Aside: Summary */}
        <aside className="sticky top-28 lg:col-span-4">
          <div className="bg-surface-container-lowest border-primary space-y-8 rounded-xl border-t-4 p-8 shadow-lg">
            <h3 className="font-headline border-surface-container border-b pb-4 text-xl font-bold">
              Sammanfattning
            </h3>
            <div className="space-y-4">
              <div className="text-on-surface-variant flex justify-between">
                <span>
                  {serviceLabel}
                  {hasSize
                    ? ` (${watchedSize} kvm • ${watchedAutoHours ? "~" : ""}${hoursLabel} tim)`
                    : ""}
                </span>
                <span className="font-medium">
                  {hasSize ? `${pricing.base} kr` : "—"}
                </span>
              </div>
              {pricing.discount > 0 && (
                <div className="text-on-surface-variant flex justify-between">
                  <span>
                    {freqLabel} (-{Math.round(pricing.discountPct * 100)}%)
                  </span>
                  <span className="font-medium">-{pricing.discount} kr</span>
                </div>
              )}
              {availableAddons.map((addon) => {
                const state = watchedAddons?.[addon];
                if (!state?.enabled) return null;
                const info = ADDON_INFO[addon];
                const cost = info.pricePerHour * (Number(state.hours) || 1);
                return (
                  <div
                    key={addon}
                    className="text-on-surface-variant flex justify-between"
                  >
                    <span>
                      {info.label} ({state.hours}h)
                    </span>
                    <span className="font-medium">{cost} kr</span>
                  </div>
                );
              })}
              <div className="text-on-surface-variant flex justify-between">
                <span>Serviceavgift</span>
                <span className="font-medium">{SERVICE_FEE} kr</span>
              </div>
              {pricing.movingFloorApplied && hasSize && (
                <div className="bg-primary-container/20 text-primary rounded-md p-3 text-xs">
                  Minimum för flyttstädning: {MOVING_MIN_BEFORE_RUT} kr före
                  RUT-avdrag.
                </div>
              )}
            </div>
            <div className="border-surface-container space-y-2 border-t pt-6">
              <div className="text-on-surface-variant flex justify-between text-sm">
                <span>{isB2B ? "Pris inkl. moms" : "Pris före RUT"}</span>
                <span>{hasSize ? `${pricing.subtotal} kr` : "—"}</span>
              </div>
              <div className="text-on-surface flex justify-between text-2xl font-extrabold">
                <span>
                  Ditt pris
                  <span className="text-primary block text-xs font-medium">
                    {isB2B ? "(exkl. moms)" : "(efter RUT)"}
                  </span>
                </span>
                <span className="text-primary">
                  {hasSize
                    ? `${isB2B ? pricing.exMoms : pricing.afterRut} kr`
                    : "—"}
                </span>
              </div>
              <p className="text-on-surface-variant mt-2 text-[10px] italic">
                {isB2B
                  ? "* B2B-pris visas exklusive moms. Moms tillkommer vid fakturering."
                  : "* Priset inkluderar moms. Vi sköter all administration med Skatteverket."}
              </p>
            </div>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="signature-gradient text-on-primary w-full rounded-full py-4 text-lg font-bold shadow-md transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? "Skickar..." : "Bekräfta bokning"}
            </button>
            <div className="space-y-4 pt-8">
              <div className="text-on-surface-variant flex items-center gap-3 text-sm">
                <VerifiedUserIcon className="size-5 shrink-0 text-green-600" />
                <span>Full ansvarsförsäkring ingår</span>
              </div>
              <div className="text-on-surface-variant flex items-center gap-3 text-sm">
                <LockOpenIcon className="size-5 shrink-0 text-green-600" />
                <span>Ingen bindningstid</span>
              </div>
              <div className="text-on-surface-variant flex items-center gap-3 text-sm">
                <EcoIcon className="size-5 shrink-0 text-green-600" />
                <span>Svanenmärkt städning</span>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </>
  );
};
