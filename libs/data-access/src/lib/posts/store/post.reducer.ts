import { Post, PostComment } from '../interfaces/post.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './post.actions';

export interface PostState {
  posts: Post[];
  comments: Record<number, PostComment[]>;
}

export const initialState: PostState = {
  posts: [],
  comments: {}
};

export const postFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialState,

    on(postActions.loadPostsSuccess, (state, { posts }) => ({
      ...state,
      posts
    })),

    on(postActions.createPostSuccess, (state, { post }) => ({
      ...state,
      posts: [post, ...state.posts]
    })),

    on(postActions.loadCommentsSuccess, (state, { postId, comments }) => ({
      ...state,
      comments: {
        ...state.comments,
        [postId]: comments
      }
    }))
  )
});
