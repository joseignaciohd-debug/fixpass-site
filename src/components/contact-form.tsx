"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      addressLine1: String(formData.get("addressLine1") || ""),
      details: String(formData.get("details") || ""),
      city: String(formData.get("city") || ""),
    };

    setState("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setState("success");
      setMessage("Thanks. A Fixpass team member will follow up shortly.");
      form.reset();
    } catch {
      setState("error");
      setMessage(
        "Could not submit your request. Please try again or email support@fixpass.com.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="surface-card rounded-[32px] p-7 sm:p-10"
    >
      <div className="border-b border-ink/8 pb-5">
        <p className="eyebrow">Talk to Fixpass</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
          Start your membership
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Tell us what you need. We&apos;ll help you choose the right plan and
          get you scheduled quickly.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-ink/80"
          >
            Full name
          </label>
          <input id="name" name="name" required className="fp-input" />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-ink/80"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="fp-input"
            autoComplete="email"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-ink/80"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            className="fp-input"
            placeholder="(713) 555-0188"
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="mb-1.5 block text-sm font-medium text-ink/80"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            placeholder="Katy"
            className="fp-input"
          />
        </div>
        <div>
          <label
            htmlFor="addressLine1"
            className="mb-1.5 block text-sm font-medium text-ink/80"
          >
            Property address
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            placeholder="Street address in Katy, TX"
            className="fp-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="details"
            className="mb-1.5 block text-sm font-medium text-ink/80"
          >
            What would you like help with?
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            required
            className="fp-input resize-none"
            placeholder="Shelves to mount, a few picture hangs, a sticky door…"
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink/55">
          Submitting doesn&apos;t charge anything. An operator will follow up
          to confirm fit and plan.
        </p>
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-parchment shadow-[0_20px_50px_-24px_rgba(11,27,54,0.6)] transition hover:-translate-y-0.5 hover:bg-navy disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "loading" ? "Submitting…" : "Request access"}
          <ArrowRight size={16} />
        </button>
      </div>

      {message ? (
        <div
          className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            state === "error"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-sage/30 bg-sage-soft text-[#3f5139]"
          }`}
        >
          {state === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : null}
          <span>{message}</span>
        </div>
      ) : null}
    </form>
  );
}
