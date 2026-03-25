import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-brand-mist/40">
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <p className="font-display text-lg font-semibold text-brand-espresso">Admin</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-espresso/45">Control room</p>
          <nav className="mt-4 flex flex-col gap-1 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2.5 text-brand-espresso/75 transition-colors duration-200 hover:bg-white hover:text-brand-espresso hover:shadow-sm"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="mt-4 rounded-xl px-3 py-2.5 font-medium text-brand-terracotta underline-offset-2 hover:bg-white/80 hover:underline"
            >
              ← Storefront
            </Link>
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
