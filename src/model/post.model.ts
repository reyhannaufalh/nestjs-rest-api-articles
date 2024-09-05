export class PostResponse {
  id: number;
  title: string;
  content: string;
  categoryId?: number;
  slug: string;
  publishedAt: Date;
}

export class StorePostRequest {
  title: string;
  content: string;
  categoryId: number;
}

export class UpdatePostRequest {
  title?: string;
  content?: string;
  categoryId?: number;
}
