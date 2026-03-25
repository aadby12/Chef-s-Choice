/** Subtotal in GHS + zone row → shipping fee (0 if free-shipping threshold met). */
export function shippingGhsForZone(
  subtotalGhs: number,
  zone: { fee_ghs: number | string; free_over_ghs: number | string | null } | null | undefined
): number {
  if (!zone) return 0;
  const fee = Number(zone.fee_ghs);
  const freeOver = zone.free_over_ghs != null ? Number(zone.free_over_ghs) : null;
  if (freeOver != null && subtotalGhs >= freeOver) return 0;
  return Number.isFinite(fee) ? fee : 0;
}
