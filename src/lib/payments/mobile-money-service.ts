import type {
  MobileMoneyInitiateInput,
  MobileMoneyInitiateResult,
  MobileMoneyVerifyInput,
  MobileMoneyVerifyResult,
  MobileMoneyProviderId,
} from "./types";

/**
 * Provider-agnostic Mobile Money layer.
 * Swap implementations per provider (MTN MoMo, Telecel Cash, AirtelTigo) without touching checkout UI.
 */
export interface MobileMoneyAdapter {
  initiatePayment(input: MobileMoneyInitiateInput): Promise<MobileMoneyInitiateResult>;
  verifyPayment(input: MobileMoneyVerifyInput): Promise<MobileMoneyVerifyResult>;
}

class MockMobileMoneyAdapter implements MobileMoneyAdapter {
  async initiatePayment(input: MobileMoneyInitiateInput): Promise<MobileMoneyInitiateResult> {
    if (process.env.MOBILE_MONEY_MOCK !== "true" && process.env.NODE_ENV === "production") {
      return { success: false, message: "Mobile Money not configured for production." };
    }
    const reference = `MMOCK-${input.idempotencyKey.slice(0, 8)}-${Date.now()}`;
    return {
      success: true,
      reference,
      message: "Mock prompt sent. Approve in your test wallet.",
      raw: { provider: input.provider, phone: input.phone },
    };
  }

  async verifyPayment(input: MobileMoneyVerifyInput): Promise<MobileMoneyVerifyResult> {
    const ok = input.reference.startsWith("MMOCK-");
    return {
      success: ok,
      status: ok ? "succeeded" : "failed",
      message: ok ? "Mock verification succeeded." : "Invalid reference.",
    };
  }
}

const adapters: Record<MobileMoneyProviderId, MobileMoneyAdapter> = {
  mtn_gh: new MockMobileMoneyAdapter(),
  telecel_cash: new MockMobileMoneyAdapter(),
  airteltigo_cash: new MockMobileMoneyAdapter(),
  mock: new MockMobileMoneyAdapter(),
};

export function getMobileMoneyAdapter(provider: MobileMoneyProviderId): MobileMoneyAdapter {
  return adapters[provider] ?? adapters.mock;
}
