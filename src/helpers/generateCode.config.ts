export enum CodeType {
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  INVOICE = 'INVOICE',
  TOUR = 'TOUR',
  ORDER = 'ORDER',
  PRICE = 'PRICE',
}

export const CODE_CONFIG = {
  [CodeType.BOOKING]: {
    prefix: 'BOOK',
    sequence: 'booking_code_seq',
  },
  [CodeType.PAYMENT]: {
    prefix: 'PAY',
    sequence: 'payment_code_seq',
  },
  [CodeType.INVOICE]: {
    prefix: 'INV',
    sequence: 'invoice_code_seq',
  },
  [CodeType.TOUR]: {
    prefix: 'TOUR',
    sequence: 'tour_code_seq',
  },
  [CodeType.ORDER]: {
    prefix: 'ORD',
    sequence: 'order_code_seq',
  },
  [CodeType.PRICE]: {
    prefix: 'PRICE',
    sequence: 'price_code_seq',
  },
} as const;

export interface CodeQueryRepo {
  query<T = any>(sql: string): Promise<T[]>;
}
