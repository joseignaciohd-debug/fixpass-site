"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FixpassWordmark } from "@/components/brand/fixpass-mark";
import { publicRoutes } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-ink/8 bg-parchment/82 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <FixpassWordmark size="md" />
          <span className="hidden items-center gap-2 border-l border-ink/15 pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/60 md:inline-flex">
            Katy, TX
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white/70 px-1.5 py-1.5 text-sm text-ink/80 shadow-[0_18px_50px_-32px_rgba(11,27,54,0.35)] backdrop-blur-md lg:flex">
          {publicRoutes.slice(1).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 font-medium transition",
                  isActive
                    ? "bg-ink text-parchment shadow-sm"
                    : "hover:bg-ink/5 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/sign-in" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button href="/join" size="sm">
            Join Fixpass
          </Button>
        </div>
      </div>
    </header>
  );
}
