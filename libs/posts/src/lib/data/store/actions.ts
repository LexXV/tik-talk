import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface';

export const postActions = createActionGroup({
  source: 'post',
  events: {
    'load posts': emptyProps(),
    'load posts success': props<{ posts: Post[] }>(),
    'create post': props<{ payload: PostCreateDto }>(),
    'create post success': props<{ post: Post }>(),

    'load comments': props<{ postId: number }>(),
    'load comments success': props<{
      postId: number;
      comments: PostComment[];
    }>(),
    'create comment': props<{ payload: CommentCreateDto }>()
  }
});
