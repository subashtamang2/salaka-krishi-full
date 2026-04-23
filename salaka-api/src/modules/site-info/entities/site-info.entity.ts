import { Exclude, Expose } from "class-transformer";

export class SiteInfo {
  @Expose()
  id: string;
  @Exclude()
  key: string;
  @Expose()
  name: string;
  @Expose()
  logoUrl: string;
  @Expose()
  keywords: string[];
  @Expose()
  description: string;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  address?: string;
  @Expose()
  socialMediaLinks: any;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}

export class Socialmedia {
  @Expose()
  socialMediaLinks: string;
}
