import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject, Subscription } from 'rxjs';
import { AppConfigService } from '@tt/shared';
import { ProfileEffects } from './profile.effects';
import { profileActions } from './profile.actions';
import { selectProfileFilters, selectProfilePageable } from './profile.selectors';
import { Profile } from '../interfaces/profile.interface';

describe('ProfileEffects filtering HTTP contract', () => {
  let actions: Subject<Action>,
    http: HttpTestingController,
    effects: ProfileEffects,
    store: MockStore;
  let subscription: Subscription;
  beforeEach(() => {
    actions = new Subject<Action>();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            { selector: selectProfileFilters, value: { firstName: 'Old' } },
            { selector: selectProfilePageable, value: { page: 2, size: 10 } },
          ],
        }),
        { provide: AppConfigService, useValue: { apiUrl: '/api' } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    effects = TestBed.inject(ProfileEffects);
    store = TestBed.inject(MockStore);
  });
  afterEach(() => {
    subscription?.unsubscribe();
    actions.complete();
    store.resetSelectors();
    http.verify();
  });

  it('uses latest filters/page, cancels obsolete HTTP and emits only current profile payload', () => {
    const emitted: Action[] = [];
    subscription = effects.filterProfiles.subscribe((action) => emitted.push(action));
    actions.next(profileActions.setPage({ page: 2 }));
    const obsolete = http.expectOne((request) => request.url === '/api/account/accounts');
    expect(obsolete.request.params.get('page')).toBe('2');
    expect(obsolete.request.params.get('firstName')).toBe('Old');
    store.overrideSelector(selectProfileFilters, { firstName: 'Current' });
    store.overrideSelector(selectProfilePageable, { page: 1, size: 10 });
    store.refreshState();
    actions.next(profileActions.filterEvents({ filters: { firstName: 'Current' } }));
    expect(obsolete.cancelled).toBe(true);
    const current = http.expectOne((request) => request.url === '/api/account/accounts');
    expect(current.request.method).toBe('GET');
    expect(current.request.params.get('firstName')).toBe('Current');
    expect(current.request.params.get('page')).toBe('1');
    const profile: Profile = {
      id: 7,
      username: 'synthetic',
      firstName: 'Current',
      lastName: 'User',
      description: '',
      avatarUrl: null,
      subscribersAmount: 0,
      isActive: true,
      stack: [],
      city: '',
    };
    current.flush({ items: [profile], page: 1, size: 10, total: 1, pages: 1 });
    expect(emitted).toEqual([profileActions.profilesLoaded({ profiles: [profile] })]);
  });

  it('surfaces API failure without emitting a false success (recovery is an application gap)', () => {
    const next = jest.fn(),
      error = jest.fn();
    subscription = effects.filterProfiles.subscribe({ next, error });
    actions.next(profileActions.filterEvents({ filters: {} }));
    http
      .expectOne((request) => request.url === '/api/account/accounts')
      .flush({ detail: 'failed' }, { status: 500, statusText: 'Failure' });
    expect(next).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0].status).toBe(500);
  });
});
