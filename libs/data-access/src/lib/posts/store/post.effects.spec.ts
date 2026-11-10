import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AppConfigService } from '@tt/shared';
import { PostEffects } from './post.effects';
import { postActions } from './post.actions';
import { PostComment } from '../interfaces/post.interface';

describe('PostEffects comment request independence', () => {
  it('keeps requests for two posts alive and associates out-of-order responses with the correct ID', () => {
    const actions = new Subject<Action>();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockActions(() => actions),
        { provide: AppConfigService, useValue: { apiUrl: '/api' } },
      ],
    });
    const http = TestBed.inject(HttpTestingController),
      emitted: Action[] = [];
    const subscription = TestBed.inject(PostEffects).loadComments$.subscribe((action) =>
      emitted.push(action),
    );
    try {
      actions.next(postActions.loadComments({ postId: 10 }));
      const first = http.expectOne('/api/post/10');
      actions.next(postActions.loadComments({ postId: 20 }));
      const second = http.expectOne('/api/post/20');
      expect(first.cancelled).toBe(false);
      const comment = (postId: number): PostComment => ({
        id: postId + 1,
        postId,
        text: `Comment ${postId}`,
        author: { id: 7, username: 'synthetic', avatarUrl: '', subscribersAmount: 0 },
        commentId: 0,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      });
      second.flush({ comments: [comment(20)] });
      first.flush({ comments: [comment(10)] });
      expect(emitted).toEqual([
        postActions.loadCommentsSuccess({ postId: 20, comments: [comment(20)] }),
        postActions.loadCommentsSuccess({ postId: 10, comments: [comment(10)] }),
      ]);
    } finally {
      subscription.unsubscribe();
      actions.complete();
      http.verify();
    }
  });
});
