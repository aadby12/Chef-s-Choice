import crypto from "crypto";

const PAYSTACK_API = "https://api.paystack.co";

function secret(): string {
  const k = process.env.PAYSTACK_SECRET_KEY;
  if (!k) throw new Error("Missing PAYSTACK_SECRET_KEY");
  return k;
}

export type PaystackInitializeResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

/** Amount in GHS; Paystack expects pesewas (×100) for GHS. */
export async function paystackInitializeTransaction(input: {
  email: string;
  amountGhs: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}): Promise<PaystackInitializeResult> {
  const amount = Math.round(Number(input.amountGhs) * 100);
  if (amount < 1) {
    throw new Error("Invalid Paystack amount");
  }

  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount,
      currency: "GHS",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata ?? {},
    }),
  });

  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: { authorization_url: string; access_code: string; reference: string };
  };

  if (!json.status || !json.data?.authorization_url) {
    throw new Error(json.message || "Paystack initialize failed");
  }

  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
    reference: json.data.reference,
  };
}

export type PaystackVerifyData = {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata: Record<string, unknown> | null;
};

export async function paystackVerifyTransaction(reference: string): Promise<{
  success: boolean;
  data?: PaystackVerifyData;
  message?: string;
}> {
  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret()}` },
  });
  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: PaystackVerifyData;
  };
  if (!json.status || !json.data) {
    return { success: false, message: json.message };
  }
  return { success: true, data: json.data };
}

/** Raw request body string (as received). */
export function isValidPaystackWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const hash = crypto.createHmac("sha512", secret()).update(rawBody).digest("hex");
  return hash === signature;
}
