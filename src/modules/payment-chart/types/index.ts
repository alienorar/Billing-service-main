export type ProcessedData ={
  totalAmount: number;
  providers: {
    provider: string;
    sum: number;
    percent: number;
  }[];
  paymentCount: number;
}

export type PaymentItem = {
  from: string; // "21-07-2025 0:00:00"
  to: string;   // "28-07-2025 0:00:00"
  providerStatistics: ProviderStat[];
  allPaymentAmount: number;
}

interface ProviderStat {
  provider: string;
  sum: number;
}