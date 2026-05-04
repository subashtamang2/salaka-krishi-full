export interface Gallery {
  imageUrl: string;
  title?: string;
  altText?: string;
  isPublished: boolean;
}

export interface GalleryResponse extends Gallery {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryPayload extends Gallery {}

export interface UpdateGalleryPayload extends Partial<Gallery> {}
