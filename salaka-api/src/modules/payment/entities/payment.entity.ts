export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export class Payment {
  id: string;
  orderId: string;
  transaction_uuid: string;
  amount: number;
  status: PaymentStatus;
  refId?: string;
  createdAt: Date;
}
