export enum USER_STATUS {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
  Revoke = 'Revoke',
  Unverified = 'Unverified'
}

export enum ROLE {
  User = 'User',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin'
}

export interface CustomerSchema {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
  email: string;
  role: ROLE;
  status: USER_STATUS;
  noOfProductIncart: number;
  createdAt: string;
  updatedAt: string;
}
