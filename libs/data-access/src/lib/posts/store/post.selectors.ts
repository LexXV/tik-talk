import { createSelector } from '@ngrx/store';
import { postFeature } from './post.reducer';

export const selectPosts = createSelector(
  postFeature.selectPosts,
  (posts) => posts
);

export const selectComments = (postId: number) =>
  createSelector(
    postFeature.selectComments,
    (comments) => comments[postId] ?? []
  );
