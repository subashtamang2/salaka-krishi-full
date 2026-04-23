export type Role = "Admin" | "SuperAdmin";
export type Status = "Active" | "Inactive" | "Suspended" | "Revoke";

export enum UserRole {
  Admin = "Admin",
  SuperAdmin = "SuperAdmin",
}
export interface staticPageContent {
  id: string;
  content: string;
}
export interface UserInterface {
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole | null;
  status?: Status | null;
  profileUrl: string | null;
  password?: null | string;
}

export interface DataWrapper<T> {
  data: T;
  message: string;
}

export interface CurrentUser extends UserInterface {
  id: string;
  _count?: {
    blogs: number;
    products: number;
    shops: number;
  };
}

export interface UserInterfaceForm extends UserInterface {
  password: string;
  file?: File | null;
}

export interface ContactInterface {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ContactStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}
