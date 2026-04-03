import Link from "next/link";
import { Container } from "@/components/layout/container";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="pb-16">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-56">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-espresso/45">Account</p>
          <nav className="mt-4 flex flex-col gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm text-brand-espresso/75 hover:bg-white hover:text-brand-espresso">
                {l.label}
              </Link>
            ))}
            <Link href="/auth/login" className="rounded-lg px-3 py-2 text-sm text-brand-terracotta hover:underline">
              Sign in
            </Link>
          </nav>
        </aside>
        <section className="flex-1">{children}</section>
      </div>
    </Container>
  );
}
