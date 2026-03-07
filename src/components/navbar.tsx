import Link from "next/link";

const links = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="inline-flex items-center gap-2" aria-label="Fixpass home">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-navy text-sm font-bold text-gold">
            F
          </span>
          <span className="text-xl font-semibold tracking-tight text-ink">Fixpass</span>
        </Link>
        <ul className="order-3 flex w-full items-center justify-center gap-5 text-center md:order-none md:w-auto md:justify-start md:gap-7">
          {links.map((link) => (
            <li key={link.href}>
              <Link className="text-sm font-medium text-slate transition hover:text-navy" href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/contact"
          className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#153364]"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
