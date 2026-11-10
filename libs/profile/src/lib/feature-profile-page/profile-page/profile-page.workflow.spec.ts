import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideStore, provideState, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { CookieService } from 'ngx-cookie-service';
import { AppConfigService } from '@tt/shared';
import { AuthService } from '@tt/data-access/auth';
import { LoginPageComponent, canActivateAuth, authTokenInterceptor } from '@tt/auth';
import { ProfileEffects, profileFeature, Profile, selectMe } from '@tt/data-access/profile';
import { PostEffects, postFeature, Post, selectPosts } from '@tt/data-access/posts';
import { ProfilePageComponent } from './profile-page.component';

// Integration in jsdom: production login/profile/components, guard, HTTP, effects,
// reducers and selectors. The route fixture omits the unrelated layout/chat shell.
describe('Protected login/profile/post workflow', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  const me: Profile = {
    id: 7,
    username: 'synthetic-user',
    firstName: 'Portfolio',
    lastName: 'Tester',
    description: 'Synthetic profile biography',
    avatarUrl: null,
    subscribersAmount: 0,
    isActive: true,
    stack: ['Angular'],
    city: 'Berlin',
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiUrl: '/api' } },
        provideStore(),
        provideState(profileFeature),
        provideState(postFeature),
        provideEffects(ProfileEffects, PostEffects),
        provideRouter([
          { path: '', pathMatch: 'full', redirectTo: 'profile/me' },
          { path: 'profile/:id', component: ProfilePageComponent, canActivate: [canActivateAuth] },
          { path: 'login', component: LoginPageComponent },
        ]),
      ],
    });
    TestBed.inject(CookieService).deleteAll('/');
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
  });
  afterEach(() => {
    http.verify();
    TestBed.inject(CookieService).deleteAll('/');
  });

  function input(selector: string, value: string) {
    const element = harness.routeNativeElement!.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >(selector)!;
    expect(element).not.toBeNull();
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    harness.detectChanges();
  }

  async function settle() {
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  function loadProfile() {
    const profile = http.expectOne('/api/account/me');
    expect(profile.request.headers.get('Authorization')).toBe('Bearer synthetic-access');
    profile.flush(me);
    http
      .expectOne('/api/account/subscribers/')
      .flush({ items: [], total: 0, page: 1, size: 10, pages: 0 });
    http.expectOne('/api/post/').flush([]);
  }

  it('redirects protected navigation, validates login, restores authenticated UI and creates a rendered post', async () => {
    await harness.navigateByUrl('/profile/me', LoginPageComponent);
    expect(TestBed.inject(Router).url).toBe('/login');
    expect(harness.routeNativeElement!.querySelector('form')).not.toBeNull();
    harness
      .routeNativeElement!.querySelector('button[type="submit"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    http.expectNone('/api/auth/token');
    input('lib-tt-input input', 'synthetic-user');
    input('input[formControlName="password"]', 'synthetic-password');
    harness
      .routeNativeElement!.querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const login = http.expectOne('/api/auth/token');
    expect(login.request.body.get('username')).toBe('synthetic-user');
    expect(login.request.body.get('password')).toBe('synthetic-password');
    login.flush({ access_token: 'synthetic-access', refresh_token: 'synthetic-refresh' });
    await settle();
    loadProfile();
    await settle();
    expect(TestBed.inject(Router).url).toBe('/profile/me');
    expect(TestBed.inject(AuthService).isAuth).toBe(true);
    expect(TestBed.inject(CookieService).get('token')).toBe('synthetic-access');
    expect(harness.routeNativeElement!.textContent).toContain('Portfolio Tester');
    expect(harness.routeNativeElement!.textContent).toContain(me.description);
    expect(TestBed.inject(Store).selectSignal(selectMe)()).toEqual(me);

    input('lib-post-feed > lib-post-input textarea', '   ');
    harness
      .routeNativeElement!.querySelector('lib-post-feed > lib-post-input button')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    http.expectNone((request) => request.method === 'POST' && request.url === '/api/post/');
    input('lib-post-feed > lib-post-input textarea', 'A meaningful portfolio post');
    harness
      .routeNativeElement!.querySelector('lib-post-feed > lib-post-input button')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const create = http.expectOne('/api/post/');
    expect(create.request.method).toBe('POST');
    expect(create.request.body).toEqual({
      title: expect.any(String),
      content: 'A meaningful portfolio post',
      authorId: me.id,
    });
    expect(create.request.headers.get('Authorization')).toBe('Bearer synthetic-access');
    const post: Post = {
      id: 42,
      title: 'Synthetic post',
      content: 'A meaningful portfolio post',
      author: me,
      communityId: null,
      images: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    create.flush(post);
    await settle();
    http.expectOne('/api/post/42').flush(post);
    await settle();
    expect(harness.routeNativeElement!.querySelector('lib-post')!.textContent).toContain(
      post.content,
    );
    expect(TestBed.inject(Store).selectSignal(selectPosts)()).toEqual([post]);
    expect(
      harness.routeNativeElement!.querySelector<HTMLTextAreaElement>(
        'lib-post-feed > lib-post-input textarea',
      )!.value,
    ).toBe('');
  });

  it('restores cookies before guarded navigation and logout blocks the next protected navigation', async () => {
    const cookies = TestBed.inject(CookieService);
    cookies.set('token', 'synthetic-access', { path: '/' });
    cookies.set('refreshToken', 'synthetic-refresh', { path: '/' });
    await harness.navigateByUrl('/profile/me', ProfilePageComponent);
    loadProfile();
    await settle();
    expect(harness.routeNativeElement!.textContent).toContain(me.description);
    TestBed.inject(AuthService).logout();
    await settle();
    await harness.navigateByUrl('/profile/me', LoginPageComponent);
    expect(TestBed.inject(Router).url).toBe('/login');
    expect(cookies.get('token')).toBe('');
    expect(cookies.get('refreshToken')).toBe('');
    expect(harness.routeNativeElement!.querySelector('form')).not.toBeNull();
    http.expectNone('/api/account/me');
  });
});
