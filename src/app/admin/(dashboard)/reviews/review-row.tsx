"use client";

import { useFormState } from "react-dom";
import { deleteReview, setReviewApproved, type ReviewActionState } from "./actions";
import { Button } from "@/components/ui/button";

type ProductRef = { name: string; slug: string };

type ReviewRow = {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  author_name: string | null;
  approved: boolean;
  created_at: string;
  /** Supabase may return one object or a one-element array for this embed */
  products?: ProductRef | ProductRef[] | null;
};

const initial: ReviewActionState = {};

function productFromEmbed(
  products: ReviewRow["products"],
): ProductRef | null {
  if (products == null) return null;
  return Array.isArray(products) ? products[0] ?? null : products;
}

export function ReviewRow({ r }: { r: ReviewRow }) {
  const [approveState, approveAction] = useFormState(setReviewApproved, initial);
  const [hideState, hideAction] = useFormState(setReviewApproved, initial);
  const [deleteState, deleteAction] = useFormState(deleteReview, initial);
  const product = productFromEmbed(r.products);

  return (
    <div className="rounded-xl border border-brand-espresso/10 bg-white p-4 text-sm shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-espresso/45">
            {r.approved ? "Approved · on storefront" : "Pending"}
          </p>
          <p className="mt-1 text-xs text-brand-espresso/50">
            {product ? (
              <>
                Product: <span className="font-medium text-brand-espresso">{product.name}</span>
              </>
            ) : (
              `Product id: ${r.product_id.slice(0, 8)}…`
            )}
          </p>
          <p className="mt-1 text-xs text-brand-espresso/50">
            {r.author_name ?? "Anonymous"} · {r.rating}/5
            {r.title ? ` · ${r.title}` : ""}
          </p>
          {r.body && <p className="mt-2 text-brand-espresso/80">{r.body}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {!r.approved ? (
            <form action={approveAction}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="approved" value="true" />
              <Button type="submit" variant="primary" size="sm">
                Approve
              </Button>
            </form>
          ) : (
            <form action={hideAction}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="approved" value="false" />
              <Button type="submit" variant="outline" size="sm">
                Hide
              </Button>
            </form>
          )}
          <form action={deleteAction}>
            <input type="hidden" name="id" value={r.id} />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-brand-terracotta/40 text-brand-terracotta hover:bg-brand-terracotta/10"
              onClick={(e) => {
                if (!confirm("Delete this review permanently?")) e.preventDefault();
              }}
            >
              Delete
            </Button>
          </form>
        </div>
      </div>
      {(approveState?.error || hideState?.error || deleteState?.error) && (
        <p className="mt-2 text-xs text-brand-terracotta">
          {approveState?.error || hideState?.error || deleteState?.error}
        </p>
      )}
    </div>
  );
}
