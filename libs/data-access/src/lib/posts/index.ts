import { Post, PostComment } from './interfaces/post.interface';
import { PostService } from './api/post.service';
import { isCommunityAuthor } from './interfaces/post.type-guards';

export * from './store';

export type {
  Post,
  PostComment,
};

export {
  PostService,
  isCommunityAuthor,
};
