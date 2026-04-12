import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { toast, Toaster } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().min(7, "Ogiltigt telefonnummer"),
  service: z.enum(["Hemstädning", "Flyttstädning", "Kontorsstädning", "Annat"]),
  message: z.string().min(10, "Minst 10 tecken"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      service: "Hemstädning",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Contact form submitted:", data);
    toast.success("Meddelande skickat!", {
      description: "Vi återkommer så snart som möjligt.",
    });
  };

  const onError = () => {
    toast.error("Formuläret är ofullständigt", {
      description: "Vänligen fyll i alla obligatoriska fält.",
    });
  };

  const inputClass = (hasError: boolean) =>
    `bg-surface-container-low w-full rounded-lg border-b-2 border-none border-transparent p-4 transition-all outline-none focus:ring-2 ${
      hasError ? "ring-2 ring-red-400" : "focus:ring-primary-container"
    }`;

  return (
    <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.04)]">
      <Toaster richColors position="top-right" />
      <h2 className="font-headline mb-8 text-3xl font-bold tracking-tight">
        Skicka ett meddelande
      </h2>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-on-surface-variant px-1 text-sm font-semibold"
            >
              Namn
            </label>
            <input
              id="name"
              className={inputClass(!!errors.name)}
              placeholder="Ditt namn"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <p className="px-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-on-surface-variant px-1 text-sm font-semibold"
            >
              E-post
            </label>
            <input
              id="email"
              className={inputClass(!!errors.email)}
              placeholder="namn@exempel.se"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="px-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-on-surface-variant px-1 text-sm font-semibold"
            >
              Telefon
            </label>
            <input
              id="phone"
              className={inputClass(!!errors.phone)}
              placeholder="070-000 00 00"
              type="tel"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="px-1 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="service"
              className="text-on-surface-variant px-1 text-sm font-semibold"
            >
              Typ av tjänst
            </label>
            <select
              id="service"
              className={inputClass(!!errors.service)}
              {...register("service")}
            >
              <option>Hemstädning</option>
              <option>Flyttstädning</option>
              <option>Kontorsstädning</option>
              <option>Annat</option>
            </select>
            {errors.service && (
              <p className="px-1 text-xs text-red-500">
                {errors.service.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-on-surface-variant px-1 text-sm font-semibold"
          >
            Meddelande
          </label>
          <textarea
            id="message"
            className={inputClass(!!errors.message)}
            placeholder="Hur kan vi hjälpa dig?"
            rows={4}
            {...register("message")}
          ></textarea>
          {errors.message && (
            <p className="px-1 text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>
        <button
          className="signature-gradient text-on-primary font-headline shadow-primary/20 w-full rounded-full py-4 font-extrabold shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Skickar..." : "Skicka förfrågan"}
        </button>
      </form>
    </div>
  );
};
