export class Post {
  id: string;
  title: string;
  date: number;
  author: string;
  excerpt: string;
  content: string;
  image?: string;
  imageDescription: string;
  published: boolean = false;

  updatedAt?: number;
}
