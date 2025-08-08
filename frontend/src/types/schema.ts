export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  likes: number;
  createdAt: string;
}

export interface PostWithAuthor extends Post {
  author: User;
}