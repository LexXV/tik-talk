import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { postActions, PostService } from '..';
import { map, mergeMap, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostEffects {
  actions$ = inject(Actions);
  postService = inject(PostService);

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.loadPosts),
      switchMap(() => {
        return this.postService.fetchPosts().pipe(
          map(posts => postActions.loadPostsSuccess({ posts }))
        );
      })
    );
  });

  createPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createPost),
      switchMap(({ payload }) => {
        return this.postService.createPost(payload).pipe(
          map(post => postActions.createPostSuccess({ post }))
        );
      })
    );
  });

  loadComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.loadComments),
      mergeMap(({ postId }) => {
        return this.postService.getCommentsByPostId(postId).pipe(
          map(comments =>
            postActions.loadCommentsSuccess({
              postId,
              comments
            })
          )
        );
      })
    );
  });

  createComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createComment),
      switchMap(({ payload }) =>
        this.postService.createComment(payload).pipe(
          map(() =>
            postActions.loadComments({
              postId: payload.postId
            })
          )
        )
      )
    );
  });
}
