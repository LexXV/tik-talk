import { Profile } from '../../profile';
import { Community } from '../../communities';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId: number;
  communityId?: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: PostAuthor;
  communityId: number | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
  comments: PostComment[];
}

export interface PostComment {
  id: number;
  text: string;
  author: {
    id: number;
    username: string;
    avatarUrl: string;
    subscribersAmount: number;
  };
  postId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateDto {
  text: string;
  authorId: number;
  postId: number;
  /*commentId: number;*/
}

export type PostAuthor = Profile | Community;
