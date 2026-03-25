export type MobileMoneyProviderId = "mtn_gh" | "telecel_cash" | "airteltigo_cash" | "mock";

export interface MobileMoneyInitiateInput {
  amountGhs: number;
  phone: string;
  provider: MobileMoneyProviderId;
  orderId: string;
  idempotencyKey: string;
}

export interface MobileMoneyInitiateResult {
  success: boolean;
  reference?: string;
  message?: string;
  raw?: Record<string, unknown>;
}

export interface MobileMoneyVerifyInput {
  reference: string;
  provider: MobileMoneyProviderId;
}

export interface MobileMoneyVerifyResult {
  success: boolean;
  status: "pending" | "succeeded" | "failed";
  message?: string;
}
