export enum NEWSLETTER_STATUS {
  Subscribed = 'Subscribed',
  Unsubscribed = 'Unsubscribed'
}

export interface NewsletterSchema {
  id: string;
  email: string;
  status: NEWSLETTER_STATUS;
  createdAt: string;
  updatedAt: string;
}
