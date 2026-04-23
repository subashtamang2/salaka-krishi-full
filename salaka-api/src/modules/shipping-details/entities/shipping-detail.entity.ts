import { Expose } from "class-transformer";

export class ShippingDetail {
  @Expose()
  id: string;

  @Expose()
  address: string;

  @Expose()
  phone: string;

  @Expose()
  user: any;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
