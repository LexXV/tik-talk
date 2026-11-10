import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Action } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AppConfigService } from '@tt/shared';
import { CommunityEffects } from './community.effects';
import { communityActions } from './community.actions';
import { Community, CreateCommunityDto } from '../interfaces/community.interface';

describe('CommunityEffects create submission concurrency', () => {
  it('suppresses overlapping submissions but accepts a new one after completion', () => {
    const actions = new Subject<Action>();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockActions(() => actions),
        provideMockStore(),
        { provide: AppConfigService, useValue: { apiUrl: '/api' } },
      ],
    });
    const http = TestBed.inject(HttpTestingController),
      emitted: Action[] = [];
    const subscription = TestBed.inject(CommunityEffects).createCommunity$.subscribe((action) =>
      emitted.push(action),
    );
    const payload: CreateCommunityDto = {
      name: 'Synthetic community',
      description: 'Example',
      tags: [],
      themes: ['OTHER'],
    };
    const created: Community = {
      ...payload,
      id: 3,
      admin: {
        id: 7,
        username: 'synthetic',
        firstName: 'Test',
        lastName: 'User',
        description: '',
        avatarUrl: null,
        subscribersAmount: 0,
        isActive: true,
        stack: [],
        city: '',
      },
      bannerUrl: null,
      avatarUrl: null,
      subscribersAmount: 1,
      createdAt: '2026-01-01T00:00:00Z',
      isJoined: true,
    };
    try {
      actions.next(communityActions.createCommunity({ community: payload }));
      actions.next(
        communityActions.createCommunity({ community: { ...payload, name: 'Duplicate' } }),
      );
      const request = http.expectOne('/api/community/');
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(payload);
      http.expectNone('/api/community/');
      request.flush(created);
      expect(emitted).toEqual([communityActions.communityCreated({ community: created })]);
      actions.next(communityActions.createCommunity({ community: { ...payload, name: 'Next' } }));
      const next = http.expectOne('/api/community/');
      expect(next.request.body.name).toBe('Next');
      next.flush({ ...created, id: 4, name: 'Next' });
      expect(emitted).toEqual([
        communityActions.communityCreated({ community: created }),
        communityActions.communityCreated({ community: { ...created, id: 4, name: 'Next' } }),
      ]);
    } finally {
      subscription.unsubscribe();
      actions.complete();
      http.verify();
    }
  });
});
