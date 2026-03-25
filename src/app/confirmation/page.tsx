import Link from "next/link";
import { Container } from "@/components/layout/container";
import { finalizePaystackOrderIfNeeded } from "@/lib/payments/paystack-order";
import { finalizeMobileMoneyOrderIfNeeded } from "@/lib/payments/mobile-money-order";

type Props = {
  searchParams: Promise<{ orderId?: string; reference?: string; trxref?: string }>;
};

export const dynamic = "force-dynamic";

function isLikelyMockMobileMoneyRef(reference: string) {
  return reference.startsWith("MMOCK-");
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const sp = await searchParams;
  const orderId = sp.orderId;
  const referenceRaw = sp.reference ?? sp.trxref ?? null;
  const reference = referenceRaw ? decodeURIComponent(referenceRaw) : null;

  let paymentSync: "none" | "ok" | "pending" = "none";
  if (reference) {
    const result = isLikelyMockMobileMoneyRef(reference)
      ? await finalizeMobileMoneyOrderIfNeeded(reference, orderId ?? null)
      : await finalizePaystackOrderIfNeeded(reference, orderId ?? null);
    paymentSync = result.ok ? "ok" : "pending";
  }

  return (
    <Container className="pb-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-espresso/45">Thank you</p>
      <h1 className="mt-3 font-display text-4xl text-brand-espresso">Your order is in motion</h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brand-espresso/70">
        We’re preparing dispatch notes for Accra. You’ll receive updates by email and WhatsApp for delivery coordination.
      </p>
      {reference && paymentSync === "ok" && (
        <p className="mx-auto mt-6 max-w-md rounded-2xl border border-brand-sage/30 bg-brand-sage/10 px-4 py-3 text-sm text-brand-espresso/80">
          Payment recorded successfully. We’ll follow up on dispatch shortly.
        </p>
      )}
      {reference && paymentSync === "pending" && (
        <p className="mx-auto mt-6 max-w-md rounded-2xl border border-brand-clay/30 bg-brand-mist/60 px-4 py-3 text-sm text-brand-espresso/80">
          Payment is being confirmed. If this message persists, contact us with your reference:{" "}
          <span className="font-mono font-semibold">{reference}</span>
        </p>
      )}
      {orderId && (
        <p className="mt-6 rounded-2xl border border-brand-espresso/10 bg-white px-4 py-3 text-sm font-mono text-brand-espresso">
          Order reference · <span className="font-semibold">{orderId}</span>
        </p>
      )}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-espresso px-8 text-sm font-semibold text-brand-cream hover:bg-brand-charcoal"
        >
          Continue shopping
        </Link>
        <Link href="/account/orders" className="text-sm font-medium text-brand-terracotta hover:underline">
          View order history
        </Link>
      </div>
    </Container>
  );
}
