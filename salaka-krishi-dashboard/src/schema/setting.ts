export interface SettingInterface {
  name: string;
  logoUrl: string | null;
  keywords: string[];
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface SettingSchema extends SettingInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialmediaInterface {
  socialMediaLinks: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    youtube: string | null;
    linkedin: string | null;
    pinterest: string | null;
  };
}
