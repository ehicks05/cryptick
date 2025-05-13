export interface Currency {
  details: CurrencyDetail;
  id: string;
  max_precision: string;
  min_size: string;
  name: string;
  status: string;
}

export enum CurrencyType {
  CRYPTO = 'crypto',
  FIAT = 'fiat',
}

export interface CurrencyDetail {
  crypto_address_link: string;
  crypto_transaction_link: string;
  min_withdrawal_amount: number;
  network_confirmations: number;
  processing_time_seconds?: number;
  push_payment_methods: CurrencyType[];
  sort_order: number;
  symbol: string;
  type: CurrencyType;
}
