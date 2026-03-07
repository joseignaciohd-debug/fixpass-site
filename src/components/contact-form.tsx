"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      details: String(formData.get("details") || ""),
      city: String(formData.get("city") || ""),
    };

    setState("loading");

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
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Talk to Fixpass</h1>
      <p className="mt-2 text-sm text-slate">Tell us what you need. We&apos;ll help you choose the right plan and launch quickly.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">Full name</label>
          <input id="name" name="name" required className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-navy/20 focus:ring" />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email</label>
          <input id="email" name="email" type="email" required className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-navy/20 focus:ring" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="city" className="mb-1 block text-sm font-medium text-ink">City</label>
          <input id="city" name="city" placeholder="Houston" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-navy/20 focus:ring" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="details" className="mb-1 block text-sm font-medium text-ink">What would you like help with?</label>
          <textarea id="details" name="details" rows={4} required className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-navy/20 focus:ring" />
        </div>
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-5 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#153364] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "loading" ? "Submitting..." : "Request Early Access"}
      </button>

      {state === "success" && <p className="mt-3 text-sm text-emerald-700">Thanks. Our team will contact you shortly.</p>}
      {state === "error" && <p className="mt-3 text-sm text-red-600">Could not submit. Please try again.</p>}
    </form>
  );
}
