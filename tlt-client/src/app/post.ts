export class Post {
  id: string;
  title: string;
  date: number;
  author: string;
  excerpt: string;
  content: string;
  image?: string;
  imageDescription: string;
  status: string = 'DRAFT';
  tags?: Array<string>;
  slug?: string;

  updatedAt?: number;
}
