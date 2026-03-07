"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setState("success");
      setEmail("");
      setName("");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Join waitlist">
      <h3 className="text-lg font-semibold text-ink">Get launch updates</h3>
      <p className="mt-1 text-sm text-slate">Secure your spot for early access and priority onboarding.</p>
      <div className="mt-4 grid gap-3">
        <label className="text-sm font-medium text-ink" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-navy/20 transition focus:ring"
          placeholder="Your name"
        />
        <label className="text-sm font-medium text-ink" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-navy/20 transition focus:ring"
          placeholder="you@email.com"
        />
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-4 w-full rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#153364] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "loading" ? "Submitting..." : "Join Waitlist"}
      </button>
      {state === "success" && <p className="mt-3 text-sm text-emerald-700">You&apos;re in. We&apos;ll reach out soon.</p>}
      {state === "error" && <p className="mt-3 text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}
